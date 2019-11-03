import { trigger, state, style, transition, animate} from '@angular/animations';

export const Animations = [
    trigger('milestoneAnim', [
        state('true', style({
            height: '{{ptc}}%'
        }),  {params: {ptc: 0}}),
        transition('false => true', animate('500ms ease-out'))
    ])
]