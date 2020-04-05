import csv from 'csvtojson';
import Menu from "./Menu";

export default class MealPlan {
    /**
     * Different menus to be consumed through a day. i.e Breakfast, Lunch, etc
     */
    public items: Array<Menu> = [];

    public add(item: Menu): void {
        this.items.push(item);
    }

    public clone(from: MealPlan): void {
        from.items.forEach(item => {
            this.items.push(new Menu(item.name, item.items));
        });
    }

    public async import(csvcontents: string): Promise<void> {
        let parser = csv();
        let json = await parser.fromString(csvcontents);
        json.forEach(item => {
            let items: Array<string> = [];
            if (item.Item_0 !== '') {
                items.push(item.Item_0);
            }
            if (item.Item_1 !== '') {
                items.push(item.Item_1);
            }
            if (item.Item_2 !== '') {
                items.push(item.Item_2);
            }
            if (item.Item_3 !== '') {
                items.push(item.Item_3);
            }
            this.add(new Menu(item.Name, items));
        });
    }
}