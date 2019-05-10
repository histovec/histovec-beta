import elasticsearch from '../db/elasticsearch'

function checkUuid (uuid) {
  return uuid ? uuid.match(/[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}/) : false
}

function checkId (id) {
  return id ? id.match(/[A-Za-z0-9_-]{43}=/) : false
}

function addStreamEvent(res, json) {
  res.write(`data: ${JSON.stringify(json)}\n\n`)
}

function endStreamEvent(res) {
  res.write('data: END-OF-STREAM')
}

async function searchSIV(id, uuid) {
  try {
    if (checkUuid(uuid) && checkId(id)) {
      const response = await elasticsearch.Client.search({
        index: elasticsearch.defaultIndex,
        q: id,
        size: 1,
        terminate_after: 1,
        filter_path: 'hits.hits._source.v'
      })
      let hits = response.hits && response.hits.hits
      if (hits) {
        if (hits.length > 0) {
          let hit = hits[0]._source && hits[0]._source.v
          if (hit) {
            return {
              status: 200,
              v: hit
            }
          } else {
            console.trace('Bad Content')
            return {
              status: 500,
              message: 'Bad Content'
            }
          }
        } else {
          return {
            status: 404,
            message: 'Not Found'
          }
        }
      }
    } else {
      return {
        status: 400,
        message: 'Bad Request'
      }
    }
  } catch (error) {
    console.trace(error.message)
    return {
      status: 500,
      message: error.message
    }
  }
}

async function getUTAC(plaque) {
  return await searchSIV(plaque, 'nimp')
}


export async function report (req, res) {
  let response = await searchSIV(req.body.id, req.body.uuid)
  if (response.status === 200) {
    res.status(200).json({
      success: true,
      v: response.v
    })
  } else {
    res.status(response.status).json({
      success: false,
      message: response.message
    })
  }  
}

export async function reportStream (req, res) {  
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  })

  let response = await searchSIV(req.body.id, req.body.uuid)
  addStreamEvent(res, response)

  if (response.status === 200) {
    response = await searchSIV(req.body.id, req.body.uuid)
    if (response.status === 200) {
      addStreamEvent(res, response)
    }
  }
  endStreamEvent(res)
}



// function initialiseSSE(req, res) {
//   var messageEvent = new ServerEvent();
//   messageEvent.addData(message);
//   outputSSE(req, res, messageEvent.payload());


//   res.set({
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       "Connection": "keep-alive",
//       "Access-Control-Allow-Origin": "*"
//   });

//   res.write("retry: 10000\n\n");
// }

// function outputSSE(req, res, data) {
//   res.write(data);
// }

// function ServerEvent() {
//    this.data = "";
// };

// ServerEvent.prototype.addData = function(data) {
//   var lines = data.split(/\n/);

//   for (var i = 0; i < lines.length; i++) {
//       var element = lines[i];
//       this.data += "data:" + element + "\n";
//   }
// }

// ServerEvent.prototype.payload = function() {
//   var payload = "";

//   payload += this.data;
//   return payload + "\n";
// }
