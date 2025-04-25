import Debouncer from '@vdegenne/debouncer';
import { css, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { literal, html as staticHtml, } from 'lit/static-html.js';
import { bindInput } from './bindInput.js';
import { MdInputChip } from '@material/web/chips/input-chip.js';
export class FormBuilder {
    constructor(host) {
        this.host = host;
    }
    TEXTFIELD(label, key, options) {
        return TEXTFIELD(label, this.host, key, options);
    }
    TEXTAREA(label, key, options) {
        return TEXTAREA(label, this.host, key, options);
    }
    SWITCH(headline, key, options) {
        return SWITCH(headline, this.host, key, options);
    }
    SLIDER(label, key, options) {
        return SLIDER(label, this.host, key, options);
    }
    SELECT(label, key, choices) {
        return SELECT(label, this.host, key, choices);
    }
    CHIPSELECT(label, key, choices, options) {
        return CHIPSELECT(label, this.host, key, choices, options);
    }
    FILTER(label, key, choices, options) {
        return FILTER(label, this.host, key, choices, options);
    }
}
export const SWITCH = (headline, host, key, options) => {
    const _options = {
        autofocus: false,
        supportingText: undefined,
        overline: undefined,
        checkbox: false,
        ...options,
    };
    return html `
		<md-list-item
			type="button"
			@click=${() => {
        host[key] = !host[key];
    }}
			class="select-none cursor-pointer flex items-center gap-3"
			style="--md-list-item-top-space:var(--forms-switch-padding);--md-list-item-bottom-space:var(--forms-switch-padding);--md-list-item-leading-space:var(--forms-switch-padding);--md-list-item-trailing-space:var(--forms-switch-padding);"
		>
			${_options.checkbox
        ? html `
						<md-checkbox slot="start" ?checked=${host[key]} inert></md-checkbox>
					`
        : html `
						<md-switch slot="start" ?selected=${host[key]} inert></md-switch>
					`}
			${_options.overline
        ? html ` <div slot="overline">${_options.overline}</div> `
        : null}
			<div slot="headline">${headline}</div>
			${_options.supportingText
        ? html ` <div slot="supporting-text">${_options.supportingText}</div> `
        : null}
		</md-list-item>
	`;
};
export const SLIDER = (label, host, key, options) => {
    const _options = {
        autofocus: false,
        min: 0,
        max: 10,
        step: 1,
        range: false,
        eventType: 'input',
        timeoutMs: 0,
        ticks: false,
        ...options,
    };
    const sliderRef = createRef();
    function assignValues() {
        const slider = sliderRef.value;
        if (slider.range) {
            host[key] = [slider.valueStart, slider.valueEnd];
        }
        else {
            host[key] = slider.value;
        }
    }
    const assignValuesDebouncer = new Debouncer(assignValues, _options.timeoutMs);
    function eventCallBack(event) {
        if (event.type === _options.eventType) {
            if (event.type === 'input') {
                assignValuesDebouncer.call();
            }
            else {
                assignValues();
            }
        }
    }
    return html `
		<div class="flex items-center gap-3 flex-1">
			<span>${label}</span>
			<md-slider
				${ref(sliderRef)}
				class="flex-1"
				?ticks=${_options.ticks}
				labeled
				min=${_options.min}
				max=${_options.max}
				?range=${_options.range}
				value-start=${ifDefined(_options.range ? host[key][0] : undefined)}
				value-end=${ifDefined(_options.range ? host[key][1] : undefined)}
				value=${ifDefined(!_options.range ? host[key] : undefined)}
				step=${_options.step}
				@input=${eventCallBack}
				@change=${eventCallBack}
			>
			</md-slider>
		</div>
	`;
};
export const SELECT = (label, host, key, choices = []) => {
    const _select = createRef();
    return html `
		<md-filled-select
			${ref(_select)}
			quick
			value=${choices.indexOf(host[key])}
			label=${label}
			@change=${() => {
        const index = _select.value.selectedIndex;
        host[key] = choices[index];
    }}
		>
			${choices.map((item, id) => html `
					<md-select-option value=${id}>${item}</md-select-option>
				`)}
			<md-option></md-option>
		</md-filled-select>
	`;
};
MdInputChip.elementStyles.push(css `
	button.trailing.action {
		pointer-events: none;
	}
`);
export function CHIPSELECT(label, host, key, choices, options) {
    const _options = {
        autofocus: false,
        leadingIcon: 'sort',
        ...(options ?? {}),
    };
    const menuRef = createRef();
    const chipRef = createRef();
    return html `
		<md-chip-set class="relative">
			<md-input-chip
				id="chip"
				${ref(chipRef)}
				@remove=${(event) => {
        event.preventDefault();
    }}
				@click=${() => {
        menuRef.value.open = !menuRef.value.open;
    }}
				positioning="popover"
			>
				${_options.leadingIcon
        ? html `<md-icon slot="icon">${_options.leadingIcon}</md-icon>`
        : null}
				<span>${host[key]}</span>
				<md-icon
					slot="remove-trailing-icon"
					style="--md-icon-size:18px;"
					class="pointer-events-none"
					inert
					>arrow_drop_down</md-icon
				>
			</md-input-chip>

			<md-menu
				${ref(menuRef)}
				anchor="chip"
				@close-menu=${(event) => {
        const { reason: { kind: reason }, initiator, } = event.detail;
        if (reason === 'click-selection') {
            host[key] = initiator.typeaheadText;
        }
    }}
			>
				${choices.map((choice) => html `<md-menu-item>
							<div slot="headline">${choice}</div>
						</md-menu-item>`)}
			</md-menu>
		</md-chip-set>
	`;
}
export const TEXTFIELD = (label, host, key, options) => {
    const _options = {
        autofocus: false,
        type: 'text',
        suffixText: undefined,
        style: 'outlined',
        rows: 2,
        resetButton: true,
        ...options,
    };
    let style;
    switch (_options.style) {
        case 'filled':
            import('@material/web/textfield/filled-text-field.js');
            style = literal `filled`;
            break;
        case 'outlined':
            import('@material/web/textfield/outlined-text-field.js');
            style = literal `outlined`;
            break;
    }
    return staticHtml `
		<md-${style}-text-field
			class="flex-1"
			?autofocus=${_options.autofocus}
			label=${label.replace(/\*/g, '')}
			type=${_options.type}
			.rows=${_options.rows}
			value=${host[key]}
			${bindInput(host, key)}
			?required=${label.includes('*')}
			suffix-text=${ifDefined(_options.suffixText)}
		>
			${_options.resetButton
        ? html `<md-icon-button
							slot="trailing-icon"
							@click=${() => {
            host[key] = '';
        }}
							><md-icon>clear</md-icon></md-icon-button
						>`
        : null}
		</md-${style}-text-field>
	`;
};
export const TEXTAREA = (label, host, key, options) => TEXTFIELD(label, host, key, { ...options, type: 'textarea' });
export const FilterBehavior = {
    ZeroOrMore: 'zero-or-more',
    OneOrMore: 'one-or-more',
    OnlyOne: 'only-one',
};
export const FILTER = (label, host, key, choices, options) => {
    const _options = {
        autofocus: false,
        behavior: FilterBehavior.ZeroOrMore,
        sort: 'none',
        type: 'string',
        elevated: false,
        ...(options ?? {}),
    };
    const _choices = choices
        .map((choice, index) => ({ value: choice, index }))
        .sort((a, b) => {
        switch (_options.sort) {
            case 'alphabet':
                return a.value.localeCompare(b.value);
            default:
                return 0;
        }
    });
    const chipsetref = createRef();
    return html `
		<div class="flex items-center gap-4 m-0">
			${label ? html ` <div>${label}</div>` : null}
			<md-chip-set
				class="justify-stretch"
				?autofocus=${_options.autofocus}
				${ref(chipsetref)}
				@click=${async (event) => {
        const chipset = chipsetref.value;
        const chips = chipset.chips;
        const chip = event.target;
        const chipIndex = chips.indexOf(chip);
        if (chipIndex === -1) {
            // Clicked outside
            return;
        }
        const getSelectedChip = () => chips.filter((c) => c.selected);
        switch (_options.behavior) {
            case 'one-or-more':
                if (getSelectedChip().length === 0) {
                    event.preventDefault();
                    return;
                }
                break;
            case 'only-one':
                chips.forEach((c, index) => (c.selected = index === chipIndex));
                break;
        }
        const values = getSelectedChip().map((c) => _options.type === 'string'
            ? c.dataset.value
            : Number(c.dataset.index));
        host[key] =
            _options.behavior === 'only-one' ? values[0] : values;
    }}
			>
				${_choices.map((choice) => html `
						<md-filter-chip
							?elevated=${_options.elevated}
							?selected=${[]
        .concat(host[key])
        .includes(_options.type === 'string' ? choice.value : choice.index)}
							data-value=${choice.value}
							data-index=${choice.index}
							label=${choice.value}
						></md-filter-chip>
					`)}
			</md-chip-set>
		</div>
	`;
};
export const INPUT = (label, host, key, options) => {
    throw new Error('Not implemented yet.');
    return html `<!-- -->

		<!-- -->`;
};
