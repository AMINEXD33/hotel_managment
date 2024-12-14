


/**
 * a function to mass request , meaning at the same time
 * some number of calls
 * @param {*} calls 
 */
export default async function massCall(calls){
    let promises = [];
    for (let call of calls){
        promises.push(fetch(
            call.url,
            {
                method:call.method,
                body: call.body ? JSON.stringify(call.body) : undefined,
                headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials:"include"
            }
        ))
    };
    let results = await Promise.allSettled(promises);
    return results;
}