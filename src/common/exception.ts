export class Exception extends Error {
    status: number;
    data?: any;
    message: string;
    error?: string;

    constructor(status: number, message: string, error?: string, data?: any) {
        super();

        this.status = status;
        this.data = data;
        this.message = message;
        this.error = error;
    }
}

export class UserNotFoundExc extends Exception {
    constructor() {
        super(405, "user not found");
    }
}

export class UserAlreadyExistExc extends Exception {
    constructor(error?: string) {
        super(406, "user already exist", error);
    }
}

export class WrongRequestExc extends Exception {
    constructor(error?: string) {
        super(407, "wrong request content", error);
    }
}

export class ValidationExc extends Exception {
    constructor(error?: any) {
        super(407, "wrong request content", error.details[0].message);
    }
}