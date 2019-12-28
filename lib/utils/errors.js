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

class ContainerAlreadyRunningError extends BeethovenError {
    constructor(name) {
        super(`The container ${name} is already running`);
    }
}

class ContainerNotRunningError extends BeethovenError {
    constructor(name) {
        super(`The container ${name} is not running`);
    }
}

class DaemonNotRunningError extends BeethovenError {
    constructor() {
        super(`The daemon is not running`);
    }
}

module.exports = {
    BeethovenFileNotFoundError: BeethovenFileNotFoundError,
    ContainerNotFoundError: ContainerNotFoundError,
    InvalidContainerConfigError: InvalidContainerConfigError,
    ContainerAlreadyExistsError: ContainerAlreadyExistsError,
    ContainerAlreadyRunningError: ContainerAlreadyRunningError,
    ContainerNotRunningError: ContainerNotRunningError,
    DaemonNotRunningError: DaemonNotRunningError
}