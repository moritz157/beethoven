class BeethovenError extends Error{
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class BeethovenFileNotFoundError extends BeethovenError {
    constructor(path) {
        super(`Beethoven file was not found at ${path}`);
        this.data = { path }
    }
}

class ContainerNotFoundError extends BeethovenError {
    constructor(container) {
        super(`The container '${container}' was not found`);
        this.data = { container };
    }
}

class InvalidContainerConfigError extends BeethovenError {
    constructor() {
        super(`Invalid container configuration`);
    }
}

class ContainerAlreadyExistsError extends BeethovenError {
    constructor(path) {
        super(`There is already a container registered at ${path}`);
    }
}

module.exports = {
    BeethovenFileNotFoundError: BeethovenFileNotFoundError,
    ContainerNotFoundError: ContainerNotFoundError,
    InvalidContainerConfigError: InvalidContainerConfigError,
    ContainerAlreadyExistsError: ContainerAlreadyExistsError
}