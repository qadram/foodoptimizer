export default class Menu {
    /**
     * Name of the menu, i.e. Breakfast, Lunch, etc
     */
    public name: string = '';

    /**
     * Items that make up this menu, like First, Main Course, etc
     */
    public items: Array<string> = [];

    constructor(name: string, items: Array<string>) {
        this.name = name;
        this.items = [...items];
    }
}