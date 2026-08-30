import {readdir,readFile} from "node:fs/promises";
import {join} from "node:path";

const forbidden=["LOCAL MOCK DATA","ローカルモックデータ","http://localhost:8788"];
async function files(directory){const entries=await readdir(directory,{withFileTypes:true}),result=[];for(const entry of entries){const path=join(directory,entry.name);if(entry.isDirectory())result.push(...await files(path));else result.push(path)}return result}
for(const path of await files("out")){const content=await readFile(path,"utf8").catch(()=>"");for(const marker of forbidden)if(content.includes(marker))throw new Error(`Production build contains forbidden local marker in ${path}: ${marker}`)}
console.log("Production build guard passed: no local environment markers found.");
