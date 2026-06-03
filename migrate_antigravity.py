#!/usr/bin/env python3
"""
Antigravity to Antigravity IDE Migration Tool
==============================================
A self-contained script to automatically migrate extensions, custom settings, keybindings,
snippets, workspace states, and entire conversation histories from Antigravity v1
to the new Antigravity IDE.

Author: Antigravity AI Coding Assistant (pair-programmed with USER)
License: MIT
"""

import os
import sys
import time
import json
import shutil
import sqlite3
import base64
import signal
import glob
import subprocess

# Define base paths dynamically based on user's home folder
HOME = os.path.expanduser("~")
OLD_DOT_ANTIGRAVITY = os.path.join(HOME, ".antigravity")
NEW_DOT_ANTIGRAVITY = os.path.join(HOME, ".antigravity-ide")
OLD_DOT_GEMINI = os.path.join(HOME, ".gemini/antigravity")
NEW_DOT_GEMINI = os.path.join(HOME, ".gemini/antigravity-ide")
OLD_SUPPORT = os.path.join(HOME, "Library/Application Support/Antigravity")
NEW_SUPPORT = os.path.join(HOME, "Library/Application Support/Antigravity IDE")

LOG_FILE = os.path.join(NEW_DOT_GEMINI, "migration_run.log")

def log(msg, level="INFO"):
    timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
    formatted_msg = f"[{timestamp}] [{level}] {msg}"
    print(formatted_msg)
    try:
        os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(formatted_msg + "\n")
    except Exception:
        pass

def kill_running_processes():
    log("Scanning and force-terminating any running Antigravity processes...")
    my_pid = os.getpid()
    killed_any = False
    
    # 1. Broad pgrep/pkill attempts
    try:
        subprocess.run(["pkill", "-f", "Antigravity IDE"], stderr=subprocess.DEVNULL)
        subprocess.run(["pkill", "-f", "Antigravity"], stderr=subprocess.DEVNULL)
    except Exception:
        pass
        
    # 2. Precise manual process scanning
    try:
        output = subprocess.check_output(["ps", "-ef"]).decode('utf-8', errors='ignore')
        for line in output.splitlines():
            if ("Antigravity" in line or "Antigravity IDE" in line) and "grep" not in line and "migrate_antigravity.py" not in line:
                parts = line.split()
                if len(parts) > 1:
                    pid = int(parts[1])
                    if pid != my_pid:
                        try:
                            os.kill(pid, signal.SIGKILL)
                            log(f"Terminated process {pid}: {' '.join(parts[7:])}", "PROCESS")
                            killed_any = True
                        except Exception:
                            pass
    except Exception as e:
        log(f"Error checking processes: {e}", "WARNING")
        
    if killed_any:
        log("Successfully terminated active processes. Waiting 3 seconds for file locks to release...")
        time.sleep(3)
    else:
        log("No active Antigravity or Antigravity IDE processes found.")

def migrate_extensions():
    log("Migrating extensions...")
    old_ext_dir = os.path.join(OLD_DOT_ANTIGRAVITY, "extensions")
    new_ext_dir = os.path.join(NEW_DOT_ANTIGRAVITY, "extensions")
    
    old_json_path = os.path.join(old_ext_dir, "extensions.json")
    new_json_path = os.path.join(new_ext_dir, "extensions.json")
    
    if not os.path.exists(old_json_path):
        log("Old extensions.json not found. Skipping extension migration.", "WARNING")
        return
        
    os.makedirs(new_ext_dir, exist_ok=True)
    if not os.path.exists(new_json_path):
        with open(new_json_path, "w", encoding="utf-8") as f:
            f.write("[]")
            
    try:
        with open(old_json_path, "r", encoding="utf-8") as f:
            old_exts = json.load(f)
        with open(new_json_path, "r", encoding="utf-8") as f:
            new_exts = json.load(f)
    except Exception as e:
        log(f"Failed to read extensions JSON files: {e}", "ERROR")
        return
        
    new_exts_dict = {ext.get("identifier", {}).get("id", "").lower(): ext for ext in new_exts if ext.get("identifier")}
    added_count = 0
    copied_dirs = 0
    
    for old_ext in old_exts:
        identifier = old_ext.get("identifier", {})
        ext_id = identifier.get("id", "").lower()
        if not ext_id:
            continue
            
        if ext_id in new_exts_dict:
            log(f"Extension '{ext_id}' is already installed in target. Skipping registration.")
            continue
            
        # Clone data and rewrite directory paths
        migrated_ext = json.loads(json.dumps(old_ext))
        
        if "location" in migrated_ext and "path" in migrated_ext["location"]:
            migrated_ext["location"]["path"] = migrated_ext["location"]["path"].replace(OLD_DOT_ANTIGRAVITY, NEW_DOT_ANTIGRAVITY)
        if "location" in migrated_ext and "fsPath" in migrated_ext["location"]:
            migrated_ext["location"]["fsPath"] = migrated_ext["location"]["fsPath"].replace(OLD_DOT_ANTIGRAVITY, NEW_DOT_ANTIGRAVITY)
        if "location" in migrated_ext && "external" in migrated_ext["location"]:
            migrated_ext["location"]["external"] = migrated_ext["location"]["external"].replace(OLD_DOT_ANTIGRAVITY, NEW_DOT_ANTIGRAVITY)
            
        # Copy directory if it exists
        rel_loc = old_ext.get("relativeLocation")
        if rel_loc:
            src_dir = os.path.join(old_ext_dir, rel_loc)
            dst_dir = os.path.join(new_ext_dir, rel_loc)
            if os.path.exists(src_dir):
                if not os.path.exists(dst_dir):
                    log(f"Copying extension directory: {rel_loc}")
                    try:
                        shutil.copytree(src_dir, dst_dir, symlinks=True)
                        copied_dirs += 1
                    except Exception as e:
                        log(f"Failed to copy directory {rel_loc}: {e}", "ERROR")
                else:
                    log(f"Extension directory '{rel_loc}' already exists in target.")
            else:
                log(f"Listed extension directory not found at: {src_dir}", "WARNING")
                
        new_exts.append(migrated_ext)
        added_count += 1
        
    try:
        with open(new_json_path, "w", encoding="utf-8") as f:
            json.dump(new_exts, f, indent=None)
        log(f"Successfully migrated {added_count} extension entries and copied {copied_dirs} folders.")
    except Exception as e:
        log(f"Failed to write merged extensions.json: {e}", "ERROR")

def merge_vscdb(src_db, dst_db, merge_protobufs=False):
    log(f"Merging database: {os.path.basename(src_db)}")
    if not os.path.exists(src_db):
        return
        
    os.makedirs(os.path.dirname(dst_db), exist_ok=True)
    
    # 1. Read destination (target) keys
    dst_records = {}
    if os.path.exists(dst_db):
        try:
            conn = sqlite3.connect(dst_db)
            cursor = conn.cursor()
            cursor.execute("SELECT key, value FROM ItemTable")
            for row in cursor.fetchall():
                dst_records[row[0]] = row[1]
            conn.close()
        except Exception as e:
            log(f"Failed to read existing keys from target DB: {e}", "WARNING")
            
    # 2. Backup target DB
    if os.path.exists(dst_db):
        backup_path = dst_db + ".migration_backup"
        try:
            shutil.copy2(dst_db, backup_path)
        except Exception as e:
            log(f"Failed to backup target DB: {e}", "WARNING")
            
    # 3. Read source (old) keys
    src_records = {}
    try:
        conn = sqlite3.connect(src_db)
        cursor = conn.cursor()
        cursor.execute("SELECT key, value FROM ItemTable")
        for row in cursor.fetchall():
            src_records[row[0]] = row[1]
        conn.close()
    except Exception as e:
        log(f"Failed to read keys from source DB: {e}", "ERROR")
        return
        
    # 4. Merge records
    merged_records = src_records.copy()
    
    if merge_protobufs:
        # Special base64 protobuf concatenation merge for conversation histories
        protobuf_keys = [
            "antigravityUnifiedStateSync.trajectorySummaries",
            "antigravityUnifiedStateSync.sidebarWorkspaces"
        ]
        for key in dst_records:
            if key in protobuf_keys and key in src_records:
                try:
                    src_bytes = base64.b64decode(src_records[key])
                    dst_bytes = base64.b64decode(dst_records[key])
                    
                    # Protobuf repeated fields can be merged by simple binary concatenation!
                    merged_bytes = src_bytes + dst_bytes
                    merged_val = base64.b64encode(merged_bytes).decode('utf-8')
                    merged_records[key] = merged_val
                    log(f"Concatenated protobuf state key: {key} ({len(src_bytes)}B source + {len(dst_bytes)}B target)")
                except Exception as e:
                    log(f"Failed to merge protobuf key '{key}': {e}. Overwriting with target value.", "WARNING")
                    merged_records[key] = dst_records[key]
            else:
                merged_records[key] = dst_records[key]
    else:
        # Standard merge: let target (current) session keys override source keys on conflict
        merged_records.update(dst_records)
        
    # 5. Write back to destination database
    try:
        # Copy schema/DB first to preserve indices/SQLite page configurations
        if os.path.exists(src_db):
            shutil.copy2(src_db, dst_db)
            
        conn = sqlite3.connect(dst_db)
        cursor = conn.cursor()
        cursor.execute("CREATE TABLE IF NOT EXISTS ItemTable (key TEXT UNIQUE ON CONFLICT REPLACE, value BLOB)")
        cursor.execute("DELETE FROM ItemTable")
        for key, val in merged_records.items():
            cursor.execute("INSERT OR REPLACE INTO ItemTable (key, value) VALUES (?, ?)", (key, val))
        conn.commit()
        conn.close()
        log(f"Wrote {len(merged_records)} keys to database successfully.")
    except Exception as e:
        log(f"Failed to write merged database: {e}", "ERROR")

def merge_json_files(src_path, dst_path):
    if not os.path.exists(src_path):
        return
        
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    dst_data = {}
    if os.path.exists(dst_path):
        try:
            with open(dst_path, "r", encoding="utf-8") as f:
                dst_data = json.load(f)
        except Exception:
            pass
            
    try:
        with open(src_path, "r", encoding="utf-8") as f:
            src_data = json.load(f)
    except Exception as e:
        log(f"Failed to read source JSON {src_path}: {e}", "ERROR")
        return
        
    merged_data = src_data.copy()
    merged_data.update(dst_data) # Target overrides source on conflict
    
    try:
        with open(dst_path, "w", encoding="utf-8") as f:
            json.dump(merged_data, f, indent=2)
    except Exception as e:
        log(f"Failed to save merged JSON {dst_path}: {e}", "ERROR")

def migrate_app_support():
    log("Migrating User settings, keybindings, snippets, and workspace states...")
    old_user_dir = os.path.join(OLD_SUPPORT, "User")
    new_user_dir = os.path.join(NEW_SUPPORT, "User")
    
    # 1. Merge settings.json and copy keybindings.json
    merge_json_files(os.path.join(old_user_dir, "settings.json"), os.path.join(new_user_dir, "settings.json"))
    
    src_kb = os.path.join(old_user_dir, "keybindings.json")
    dst_kb = os.path.join(new_user_dir, "keybindings.json")
    if os.path.exists(src_kb):
        shutil.copy2(src_kb, dst_kb)
        
    # 2. Copy custom user snippets
    src_snippets = os.path.join(old_user_dir, "snippets")
    dst_snippets = os.path.join(new_user_dir, "snippets")
    if os.path.exists(src_snippets) and not os.path.exists(dst_snippets):
        try:
            shutil.copytree(src_snippets, dst_snippets)
        except Exception as e:
            log(f"Failed to copy snippets: {e}", "WARNING")
            
    # 3. Copy workspaces and shared_proto_db directories
    for folder in ["Workspaces", "shared_proto_db"]:
        src_f = os.path.join(OLD_SUPPORT, folder)
        dst_f = os.path.join(NEW_SUPPORT, folder)
        if os.path.exists(src_f) and not os.path.exists(dst_f):
            try:
                shutil.copytree(src_f, dst_f)
                log(f"Copied root storage folder: {folder}")
            except Exception as e:
                log(f"Failed to copy folder {folder}: {e}", "WARNING")
                
    # 4. Migrate globalStorage databases (with protobuf merge for trajectory/sidebar keys)
    old_gs = os.path.join(old_user_dir, "globalStorage")
    new_gs = os.path.join(new_user_dir, "globalStorage")
    if os.path.exists(old_gs):
        os.makedirs(new_gs, exist_ok=True)
        for item in os.listdir(old_gs):
            src_item = os.path.join(old_gs, item)
            dst_item = os.path.join(new_gs, item)
            
            if item == "state.vscdb":
                merge_vscdb(src_item, dst_item, merge_protobufs=True)
            elif item == "state.vscdb.backup":
                shutil.copy2(src_item, dst_item)
            elif item == "storage.json":
                merge_json_files(src_item, dst_item)
            else:
                if os.path.isdir(src_item) and not os.path.exists(dst_item):
                    shutil.copytree(src_item, dst_item)
                elif os.path.isfile(src_item) and not os.path.exists(dst_item):
                    shutil.copy2(src_item, dst_item)
 
    # 5. Migrate workspaceStorage databases (individual folders)
    old_ws = os.path.join(old_user_dir, "workspaceStorage")
    new_ws = os.path.join(new_user_dir, "workspaceStorage")
    if os.path.exists(old_ws):
        os.makedirs(new_ws, exist_ok=True)
        for workspace_id in os.listdir(old_ws):
            src_w = os.path.join(old_ws, workspace_id)
            dst_w = os.path.join(new_ws, workspace_id)
            if not os.path.isdir(src_w):
                continue
                
            if not os.path.exists(dst_w):
                try:
                    shutil.copytree(src_w, dst_w)
                except Exception as e:
                    log(f"Failed to copy workspace storage {workspace_id}: {e}", "WARNING")
            else:
                # Target exists: Merge the inner state database
                merge_vscdb(os.path.join(src_w, "state.vscdb"), os.path.join(dst_w, "state.vscdb"))
                
                src_backup = os.path.join(src_w, "state.vscdb.backup")
                dst_backup = os.path.join(dst_w, "state.vscdb.backup")
                if os.path.exists(src_backup):
                    shutil.copy2(src_backup, dst_backup)
                    
                # Merge missing items
                for file_item in os.listdir(src_w):
                    if file_item not in ["state.vscdb", "state.vscdb.backup"]:
                        src_f = os.path.join(src_w, file_item)
                        dst_f = os.path.join(dst_w, file_item)
                        if os.path.isdir(src_f) and not os.path.exists(dst_f):
                            shutil.copytree(src_f, dst_f)
                        elif os.path.isfile(src_f) and not os.path.exists(dst_f):
                            shutil.copy2(src_f, dst_f)

def migrate_gemini_configs():
    log("Migrating Gemini assistant states & conversation logs...")
    os.makedirs(NEW_DOT_GEMINI, exist_ok=True)
    
    # 1. Copy antigravity_state.pbtxt
    src_state = os.path.join(OLD_DOT_GEMINI, "antigravity_state.pbtxt")
    dst_state = os.path.join(NEW_DOT_GEMINI, "antigravity_state.pbtxt")
    if os.path.exists(src_state):
        shutil.copy2(src_state, dst_state)
        
    # 2. Copy agyhub_summaries_proto.pb
    src_summary = os.path.join(OLD_DOT_GEMINI, "agyhub_summaries_proto.pb")
    dst_summary = os.path.join(NEW_DOT_GEMINI, "agyhub_summaries_proto.pb")
    if os.path.exists(src_summary):
        shutil.copy2(src_summary, dst_summary)
        
    # 3. Setup MCP config symlink
    target_mcp = os.path.join(NEW_DOT_GEMINI, "mcp_config.json")
    shared_mcp = os.path.join(HOME, ".gemini/config/mcp_config.json")
    
    if os.path.exists(target_mcp) and not os.path.islink(target_mcp):
        if os.path.getsize(target_mcp) == 0:
            try:
                os.remove(target_mcp)
                os.symlink(shared_mcp, target_mcp)
                log("Replaced empty target mcp_config.json with symlink to shared config.")
            except Exception as e:
                log(f"Failed to symlink mcp_config: {e}", "WARNING")
    elif not os.path.exists(target_mcp) and os.path.exists(shared_mcp):
        try:
            os.symlink(shared_mcp, target_mcp)
            log("Created symlink for shared MCP configuration.")
        except Exception as e:
            log(f"Failed to create symlink for mcp_config: {e}", "WARNING")

    # 4. Copy raw conversation protobuf (.pb) log files
    src_convo_dir = os.path.join(OLD_DOT_GEMINI, "conversations")
    dst_convo_dir = os.path.join(NEW_DOT_GEMINI, "conversations")
    
    if os.path.exists(src_convo_dir):
        os.makedirs(dst_convo_dir, exist_ok=True)
        pb_copied = 0
        for f in os.listdir(src_convo_dir):
            if f.endswith(".pb"):
                src_file = os.path.join(src_convo_dir, f)
                dst_file = os.path.join(dst_convo_dir, f)
                if not os.path.exists(dst_file):
                    try:
                        shutil.copy2(src_file, dst_file)
                        pb_copied += 1
                    except Exception as e:
                        log(f"Failed to copy convo file {f}: {e}", "WARNING")
        log(f"Copied {pb_copied} raw conversation protobuf logs (.pb).")

def configure_pbtxt_states(status):
    log(f"Setting pbtxt migration states to {status}...")
    state_files = [
        os.path.join(OLD_DOT_GEMINI, "antigravity_state.pbtxt"),
        os.path.join(NEW_DOT_GEMINI, "antigravity_state.pbtxt")
    ]
    for state_file in state_files:
        if os.path.exists(state_file):
            try:
                with open(state_file, "r", encoding="utf-8") as f:
                    content = f.read()
                
                if status == "UNSPECIFIED":
                    content = content.replace("migrate_convos_into_projects: MIGRATION_STATUS_COMPLETED", 
                                              "migrate_convos_into_projects: MIGRATION_STATUS_UNSPECIFIED")
                else:
                    content = content.replace("migrate_convos_into_projects: MIGRATION_STATUS_UNSPECIFIED", 
                                              "migrate_convos_into_projects: MIGRATION_STATUS_COMPLETED")
                    
                with open(state_file, "w", encoding="utf-8") as f:
                    f.write(content)
                log(f"Successfully configured state file: {os.path.basename(state_file)}")
            except Exception as e:
                log(f"Failed to configure state file {state_file}: {e}", "ERROR")

def run_language_server_migration():
    log("Locating language server binary inside Antigravity IDE app bundle...")
    bin_pattern = "/Applications/Antigravity IDE.app/Contents/Resources/app/extensions/antigravity/bin/language_server_macos_*"
    binaries = glob.glob(bin_pattern)
    
    if not binaries:
        log("No matching language server binary found! Please make sure Antigravity IDE is installed in /Applications.", "ERROR")
        return False
        
    ls_binary = binaries[0]
    log(f"Using language server binary: {ls_binary}")
    
    log("Spawning standalone language server to process conversation migrations...")
    try:
        proc = subprocess.Popen([
            ls_binary,
            "--standalone",
            "--app_data_dir", "antigravity-ide"
        ], stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        log(f"Standalone language server successfully spawned (PID: {proc.pid}). Running migration pass...")
        time.sleep(8) # Allow the Go server sufficient time to run migrations offline
        proc.terminate()
        proc.wait(timeout=2)
        log("Standalone language server completed processing and shut down cleanly.")
        return True
    except subprocess.TimeoutExpired:
        try:
            proc.kill()
        except Exception:
            pass
        log("Language server process took too long to exit and was forced terminated.", "WARNING")
        return True
    except Exception as e:
        log(f"Failed to execute standalone conversation migration: {e}", "ERROR")
        return False

def count_converted_chats():
    dst_convo_dir = os.path.join(NEW_DOT_GEMINI, "conversations")
    if not os.path.exists(dst_convo_dir):
        return 0
    try:
        db_files = [f for f in os.listdir(dst_convo_dir) if f.endswith(".db") and len(f) > 36]
        return len(db_files)
    except Exception:
        return 0

def reopen_ide():
    log("Reopening Antigravity IDE...")
    try:
        subprocess.Popen(["open", "/Applications/Antigravity IDE.app"])
        log("Open command issued successfully. IDE is launching.")
    except Exception as e:
        log(f"Failed to automatically restart IDE: {e}. You may start it manually.", "WARNING")

def main():
    print(r"""
============================================================
       ANTIGRAVITY TO ANTIGRAVITY IDE MIGRATION TOOL
============================================================
 This script safely restores your extensions, custom settings,
 /keybindings, snippets, custom workspaces, and conversation
 history into the new Antigravity IDE.
============================================================
""")
    
    # Pre-checks
    if not os.path.exists(OLD_DOT_GEMINI):
        print(f"[-] Error: Could not locate old Antigravity config directory at {OLD_DOT_GEMINI}")
        print("    Make sure Antigravity v1 was installed on this machine.")
        sys.exit(1)
        
    response = input("[?] Proceed with offline migration? (This will force quit Antigravity) [y/N]: ")
    if response.strip().lower() not in ["y", "yes"]:
        print("[-] Migration cancelled by user.")
        sys.exit(0)
        
    print("\n[1/7] Terminating running processes...")
    kill_running_processes()
    
    print("\n[2/7] Migrating extensions...")
    migrate_extensions()
    
    print("\n[3/7] Migrating User settings, keybindings and layout states...")
    migrate_app_support()
    
    print("\n[4/7] Copying logs and configuration metadata...")
    migrate_gemini_configs()
    
    print("\n[5/7] Triggering Go-based conversation migration module...")
    configure_pbtxt_states("UNSPECIFIED")
    ls_success = run_language_server_migration()
    
    # Restore completed state
    configure_pbtxt_states("COMPLETED")
    
    print("\n[6/7] Verifying migrated conversation databases...")
    converted_count = count_converted_chats()
    if converted_count > 0:
        log(f"Successfully converted {converted_count} conversation history database(s)!", "SUCCESS")
    else:
        if ls_success:
            log("No conversations found, or the IDE will process them upon restart.", "INFO")
        else:
            log("Conversation database conversion was not completed. They will merge on next IDE launch.", "WARNING")
            
    print("\n[7/7] Launching fresh Antigravity IDE instance...")
    reopen_ide()
    
    print(f"""
============================================================
                      MIGRATION COMPLETE!                   
============================================================
 All items successfully merged into Antigravity IDE.
 Logs are saved to: {LOG_FILE}
 
 You're ready to pick up exactly where you left off!
============================================================
""")

if __name__ == "__main__":
    main()
