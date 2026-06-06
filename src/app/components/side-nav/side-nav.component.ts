import { ChangeDetectionStrategy, Component, input, OnInit, inject, afterNextRender } from '@angular/core';
import { SideNavTrackerService } from './side-nav-tracker.service';

export interface NavSection {
  id: string;
  label: string;
  color: string;
}

@Component({
  selector: 'portfolio-side-nav',
  standalone: true,
  providers: [SideNavTrackerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="floating-side-rail flex flex-col items-end" role="navigation" aria-label="Page sections">
      @for (sec of sections(); track sec.id) {
        <button class="nav-pill flex items-center justify-center" 
                [class.active]="tracker.activeSection() === sec.id" 
                (click)="tracker.scrollToSection(sec.id)" 
                [attr.aria-label]="'Scroll to ' + sec.label"
                [attr.aria-current]="tracker.activeSection() === sec.id ? 'step' : null"
                [style.--pill-color]="sec.color">
          <span class="pill-label">{{ sec.label }}</span>
        </button>
      }
    </nav>
  `
})
export class SideNavComponent implements OnInit {
  sections = input.required<NavSection[]>();
  intersectionSelector = input.required<string>();
  intersectionOptions = input<IntersectionObserverInit>({});
  mutationTargetSelector = input<string | null>(null);
  initialActiveId = input<string>('hero');

  tracker = inject(SideNavTrackerService);

  ngOnInit() {
    this.tracker.activeSection.set(this.initialActiveId());
  }

  constructor() {
    afterNextRender(() => {
      this.tracker.initialize({
        intersectionSelector: this.intersectionSelector(),
        intersectionOptions: this.intersectionOptions(),
        mutationTargetSelector: this.mutationTargetSelector()
      });
    });
  }
}
