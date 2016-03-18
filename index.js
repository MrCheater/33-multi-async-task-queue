function shift(map, id) {
    const tasks = map.get(id);
    tasks.shift();
    if(tasks.length === 0) {
        map.delete(id);
    } else {
        runNextTask(map, id);
    }
}

function runNextTask(map, id) {
    const tasks = map.get(id);
    const {task, resolve, reject} = tasks[0];
    const runTask = task();
    runTask.then(shift.bind(null, map, id)).then(resolve);
    runTask.catch(shift.bind(null, map, id)).catch(reject);
}

export default class MultiAsyncTaskQueue {
    constructor() {
        const map = new Map();
        this.push = this.push.bind(map);
    }
    push(id, task) {
        return new Promise((resolve, reject) => {
            const tasks = this.get(id);
            if(tasks) {
                tasks.push({task, resolve, reject});
            } else {
                this.set(id, [{task, resolve, reject}]);
                runNextTask(this, id);
            }
        });
    }
}