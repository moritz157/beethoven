# beethoven
A very very simple container orchestration system.

## Installation
First clone this repository using `git clone https://github.com/moritz157/beethoven.git`. Then use `npm install` to install all the dependencies and `npm link` after that to enable the cli.

## Usage
### Summoning the daemon
To start the daemon just use `beethoven daemon`. You probably want to configure your OS to execute this command on boot.

### Initializing a container
If you want to create a new container, just navigate to the desired directory an use `beethoven init`. Then enter the prompted information. This command will create the `beethoven.json`, which contains all the necessary information.

### Registering a container
To register the newly initialized container at the daemon use `beethoven register`.

### Starting a container
Use `beethoven start <CONTAINER_NAME>` to start the container.

### Checking the container status
`beethoven status` shows you the status of every registered container. If you want to see more info for every container, pass the `-v` flag.

### Stopping a container
`beethoven stop <CONTAINER_NAME>` stops a container.

### Start all containers
Start all containers using `beethoven start-all`

### Stop all containers
Stop all containers using `beethoven stop-all`

## Additional information
### beethoven.json
Parameters stored in the beethoven.json are:
- `name` (String): The name of the container
- `start_command` (String): The command to start the container with
- `start_arguments` (String[]): The arguments to pass with the start_command
- `version` (String): The container's version
- `autostart` (Boolean): Should the container be started automatically when the daemon starts
- `depends` (String[]): A list of names of containers, which need to be started first because this container depends on them

### Daemon API
The daemon hosts a REST-API on port 7737. **Since it has no access restriction it is strongly recommended to block port 7737 in your firewall.** All data passed in POST-Requests needs to be JSON. It's only accessible over http (not https) and has the following endpoints:

**GET** `/status`

Returns the status of every container as a list of Objects with the following parameters: `name`: String, `status`: Number, `path`: String

**POST** `/start`

Starts the container specified in the `name` parameter of the body

**POST** `/stop`

Stops the container specified in the `name` parameter of the body

**POST** `/startAll`

Starts every container

**POST** `/stopAll`

Stops every container

**POST** `/addContainer`

Registeres a container at the directory passed in the `path` parameter of the body

**POST** `/removeContainer`

Unregisteres a container at the directory passed in the `name` parameter of the body

### Get the beethoven version
You can get your beethoven version using `beethoven version`.

### Help
`beethoven help` gives you information about the CLI-commands.