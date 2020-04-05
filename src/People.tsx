import csv from 'csvtojson';

export class Person {
    name: string = '';
    age: string = '';

    constructor(name: string, age: string) {
        this.name = name;
        this.age = age;
    }
}

export default class People {
    /**
     * Different menus to be consumed through a day. i.e Breakfast, Lunch, etc
     */
    public items: Array<Person> = [];

    public add(person: Person): void {
        this.items.push(person);
    }

    public async import(csvcontents: string): Promise<void> {
        let parser = csv();
        let json = await parser.fromString(csvcontents);
        json.forEach(item => {
            this.add(new Person(item.Name, item.Age));
        });
    }
}