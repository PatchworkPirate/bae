import { v4 } from 'uuid';

export type ButtonObject = {
	id: string;
	name: string;
	decription?: string;
	triggers: {
		page: number;
		row: number;
		column: number;
	};
	toggle: boolean;
	colour: string;
	size: number;
	order: number;
	element?: HTMLOrSVGElement;
	lastFeedback?: object;
};

class ButtonStore {
	buttons: Array<ButtonObject> = $state([]);
	ipAddress: string = $state('localhost');
	port: number = $state(8888);

	constructor() {
		this.buttons.push(this.createButton(''));
		this.buttons.push(this.createButton(''));
		this.buttons.push(this.createButton(''));
		this.buttons.push(this.createButton(''));
	}

	createButton(name?: string): ButtonObject {
		const newButton: ButtonObject = {
			id: v4(),
			name: name ?? 'Button ' + String(this.buttons.length - 3),
			toggle: false,
			triggers: {
				page: 1,
				row: 1,
				column: 1
			},
			colour: '#ffffff',
			size: 140,
			order: this.buttons.length + 1
		};

		return newButton;
	}

	addButton(buttonObject: ButtonObject) {
		this.buttons.push(buttonObject);
	}

	removeButton(id?: string) {
		if (id) {
			const index = this.buttons.findIndex((btn) => btn.id === id);
			if (index !== -1) {
				this.buttons.splice(index, 1);
			}
		} else {
			this.buttons.pop();
		}
	}

	async activateButton(id: string) {
		const activatedButton = this.buttons.find((btn) => {
			return btn.id === id;
		});

		if (!activatedButton) {
			throw new Error('Could not find Button in application');
		}

		const response = await fetch(
			`http://${this.ipAddress}:${this.port}/api/location/${activatedButton.triggers.page}/${activatedButton.triggers.row}/${activatedButton.triggers.column}/down`,
			{
				method: 'POST'
			}
		);

        console.log(response)

	}

    async deactivateButton(id: string) {
        const activatedButton = this.buttons.find(btn => btn.id === id)

        if (!activatedButton) {
            throw new Error('Could not find button in application')
        }

        const response = await fetch(
			`http://${this.ipAddress}:${this.port}/api/location/${activatedButton.triggers.page}/${activatedButton.triggers.row}/${activatedButton.triggers.column}/up`,
			{
				method: 'POST'
			}
		);

        console.log(response)
    }

	loadPreset() {}

	savePreset() {}
}

export const buttonStore = new ButtonStore();
