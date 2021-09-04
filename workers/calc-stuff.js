import { evaluate } from "mathjs";
import { parentPort } from "worker_threads";

parentPort.on("message", data => {
    parentPort.postMessage(evaluate(data.expression).toString());
})

  
