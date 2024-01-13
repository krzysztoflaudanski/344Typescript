const inquirer = require('inquirer');
const consola = require('consola');

enum Action {
    List = "list",
    Add = "add",
    Edit = "edit",
    Remove = "remove",
    Quit = "quit"
}

type InquirerAnswers = {
    action: Action
}
enum MessageVariant {
    Success = 'success',
    Error = 'error',
    Info = 'info'
}

class Message {
    // Właściwość content zadeklarowana w konstruktorze
    constructor(public content: string) {
        // Brak dodatkowych instrukcji w konstruktorze
    }

    // Metoda show do wypisywania aktualnej wartości właściwości content
    public show(): void {
        console.log(this.content);
    }

    // Metoda capitalize do zmiany pierwszej litery na dużą, a pozostałych na małe
    public capitalize(): string {
        return this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1).toLowerCase();
    }

    // Metoda toUpperCase do zmiany wszystkich liter na duże
    public toUpperCase(): string {
        return this.content = this.content.toUpperCase();
    }

    // Metoda toLowerCase do zmiany wszystkich liter na małe
    public toLowerCase(): string {
        return this.content = this.content.toLowerCase();
    }

    // Metoda showColorized do wyświetlania kolorowanego tekstu w konsoli
    static showColorized(variant: MessageVariant, anyText: string): void {
        if (variant === 'success') {
            consola.success(anyText);
        } else if (variant === 'error') {
            consola.error(anyText);
        } else {
            consola.info(anyText);
        }

    }
}

//interfejs dla struktury użytkownika
interface User {
    name: string;
    age: number;
}

// Klasa UsersData z właściwością data będącą tablicą User-ów
class UsersData {
    data: User[] = [];

    showAll(): void | string {
        Message.showColorized(MessageVariant.Info, "User data...");
        if (this.data.length > 0) {
            console.table(this.data);
        } else {
            Message.showColorized(MessageVariant.Error, "No data...");
        }
    };

    add(newUser: User): void {
        if (newUser.name.length > 0 && newUser.age > 0) {
            this.data.push(newUser);
            Message.showColorized(MessageVariant.Success, "User has been successfully added!");
        } else {
            Message.showColorized(MessageVariant.Error, 'Wrong data!');
        }
    };

    edit(name: string, updatedUser: User): void {
        const userIndex = this.data.findIndex(user => user.name === name);
        if (userIndex !== -1) {
            this.data[userIndex] = updatedUser;
            Message.showColorized(MessageVariant.Success, `User ${name} edited successfully!`);
        } else {
            Message.showColorized(MessageVariant.Error, `User ${name} not found.`);
        }
    }

    remove(dataUserName: string): void {
        const userIndex = this.data.findIndex((user) => user.name === dataUserName);
        if (userIndex !== -1) {
            this.data.splice(userIndex, 1);
            Message.showColorized(MessageVariant.Success, "User has been successfully deleted!");
        } else {
            Message.showColorized(MessageVariant.Error, 'User not found...');
        }
        ;
    };

};

const users = new UsersData();
users.showAll();
users.add({ name: "Jan", age: 20 });
users.add({ name: "Adam", age: 30 });
users.add({ name: "Kasia", age: 23 });
users.add({ name: "Basia", age: -6 });
users.showAll();
users.remove("Maurycy");
users.remove("Adam");
users.showAll();

const startApp = () => {
    inquirer.prompt([{
        name: 'action',
        type: 'input',
        message: 'How can I help you?',
    }]).then(async (answers: InquirerAnswers) => {
        switch (answers.action) {
            case Action.List:
                users.showAll();
                break;
            case Action.Add:
                const user = await inquirer.prompt([{
                    name: 'name',
                    type: 'input',
                    message: 'Enter name',
                }, {
                    name: 'age',
                    type: 'number',
                    message: 'Enter age',
                }]);
                users.add(user);
                break;
            case Action.Edit:
                const editUser = await inquirer.prompt([{
                    name: 'name',
                    type: 'input',
                    message: 'Enter name to edit',
                }, {
                    name: 'updatedName',
                    type: 'input',
                    message: 'Enter updated name',
                }, {
                    name: 'updatedAge',
                    type: 'number',
                    message: 'Enter updated age',
                }]);
                users.edit(editUser.name, { name: editUser.updatedName, age: editUser.updatedAge });
                break;
            case Action.Remove:
                const name = await inquirer.prompt([{
                    name: 'name',
                    type: 'input',
                    message: 'Enter name',
                }]);
                users.remove(name.name);
                break;
            case Action.Quit:
                Message.showColorized(MessageVariant.Info, "Bye bye!");
                return;
            default:
                Message.showColorized(MessageVariant.Error, 'Command not found.');
        }
        startApp();
    });
}

startApp();