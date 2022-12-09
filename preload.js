// const { ipcRenderer } = require('electron');
// const ipcRenderer = window.require('electron').ipcRenderer;

window.addEventListener('DOMContentLoaded', () => {
  // const replaceText = (selector, text) => {
  //   const element = document.getElementById(selector)
  //   if (element) element.innerText = text
  // }

  // for (const dependency of ['chrome', 'node', 'electron']) {
  //   replaceText(`${dependency}-version`, process.versions[dependency])
  // }

  // ***
  // const { ipcRenderer } = require('electron');
  // const ipcRenderer = window.require('electron').ipcRenderer;

  // const textarea = document.getElementById('textarea');
  // const serverlist = document.getElementById("serverlist");

  const output_name = document.getElementById("output_name");
  const output_map = document.getElementById("output_map");
  const output_players = document.getElementById("output_players");
  const output_ping = document.getElementById("output_ping");

  const hidden_players = document.getElementById("hidden_players");
  const hidden_maxplayers = document.getElementById("hidden_maxplayers");
  const hidden_address = document.getElementById("hidden_address");

  // const button_join = document.getElementById("button_join");
  // const button_autojoin = document.getElementById("button_autojoin");
  const img_refresh = document.getElementById("img_refresh");
  const img_join = document.getElementById("img_join");
  const img_autojoin = document.getElementById("img_autojoin");

  const nicepingbro = document.getElementById("nicepingbro");

  const refreshTimer = 5000;

  const refreshServerList = () => {
    // textarea.value = '';
    // serverlist.innerHTML = "";
    output_name.innerHTML = '';
    output_map.innerHTML = '';
    output_players.innerHTML = '';
    output_ping.innerHTML = '';

    // button_join.value = "";
    // button_join.disabled = true;

    nicepingbro.style.display = "none";
    img_join.style.display = "none";
    img_autojoin.style.display = "none";

    var xhttp = new XMLHttpRequest();
        
    xhttp.timeout = refreshTimer; // timeout after a while

    xhttp.ontimeout = function (e) {
      console.log("request timed out")
    };

    xhttp.onreadystatechange = () => {
      // if (this.readyState == 4 && this.status == 200) {
      if (xhttp.readyState == 4) {
        let servers = JSON.parse(xhttp.responseText);

        // debug
        // console.log("all servers:")
        // servers.forEach(server => {
        //   console.log(server);
        // });

        // filter: only servers without passwords
        servers = servers.filter(server => server.Variables.bPassworded == false);

        // debug
        // console.log("filtered servers:")
        // servers.forEach(server => {
        //   console.log(server);
        // });

        // filter: get server with highest player count
        // servers = servers.sort((a,b) => a.Players > b.Players);
        servers.sort((a, b) => (a.Players < b.Players) ? 1 : -1);

        // debug
        // console.log("sorted servers:")
        // servers.forEach(server => {
        //   console.log(server);
        // });
        
        // select server with highest player count
        let server = servers[0];

        // servers.forEach(server => {
        // if (server.Players > 0) {
        // textarea.value += JSON.stringify(server);

        // serverlist.innerHTML += `<button onclick="ipcRenderer.send('join', '${server.IP}:${server.Port}');">${server.IP} [${server.Players}/${server.Variables["Player Limit"]}]</button>`
        
        output_name.innerHTML = server.Name;
        output_map.innerHTML = server["Current Map"];
        output_players.innerHTML = `${server.Players}/${server.Variables["Player Limit"]}`;

        hidden_players.value = server.Players;
        hidden_maxplayers.value = server.Variables["Player Limit"];

        if (server.Players < server.Variables["Player Limit"]) {
          // switch to join image
          img_join.style.display = "block";
          img_autojoin.style.display = "none";
        } else {
          // switch to auto-join toggle button
          img_join.style.display = "none";
          img_autojoin.style.display = "block";
        }

        ping.promise.probe(server.IP)
        .then(function (res) {
          console.log(res);
          console.log(res.time);
          output_ping.innerHTML = res.time;
          if (res.time >= 100) {
            nicepingbro.style.display = "block";
          }
        });

        hidden_address.value = `${server.IP}:${server.Port}`;
        // button_join.value = `${server.IP}:${server.Port}`;
        // button_join.disabled = false;
        // }
        // });

        if (autojoinenabled === true) {
          checkJoin();
        }
      }
    };
    // xhttp.open("GET", "https://serverlist.ren-x.com/servers.jsp?id=launcher", true);
    xhttp.open("GET", "https://serverlist-rx.totemarts.services/servers.jsp", true);
    // xhttp.setRequestHeader("User-Agent", "RenX-Launcher (0.87)");
    xhttp.send();
  }

  // toggle auto join button
  var autojoinenabled = false;
  // var joined = false;
  const toggleAutojoin = () => {
    if (autojoinenabled === true) {
      // deactivate auto-join
      autojoinenabled = false;
      // button_autojoin.innerHTML = "Activate Auto-Join";
      img_autojoin.src = "button_new_activateautojoin.png";
      // ...
    } else if (autojoinenabled === false) {
      // activate auto-join
      autojoinenabled = true;
      // button_autojoin.innerHTML = "Deactivate Auto-Join";
      img_autojoin.src = "button_new_deactivateautojoin.png";
      // ...
      // setTimeout(checkJoin, refreshTimer);
      setTimeout(refreshServerList, refreshTimer);
    }

  }
  const checkJoin = () => {
    if (autojoinenabled) {
      if (hidden_players.value > 0 && hidden_maxplayers.value > 0 && hidden_players.value < hidden_maxplayers.value) {
        // joinServer(button_join.value);
        joinServer();
        // autojoinenabled = false;
        toggleAutojoin();
      } else {
        // refreshServerList();
        // setTimeout(checkJoin, refreshTimer);
        setTimeout(refreshServerList, refreshTimer);
      }
    }
  }
  
  // add event listener to refresh button
  img_refresh.addEventListener("click", function() {
    refreshServerList();
  });

  // add event listener to join button
  img_join.addEventListener("click", function() {
    joinServer();
  });
  
  // button_autojoin.addEventListener("click", function() {
  img_autojoin.addEventListener("click", function() {
    toggleAutojoin();
  });
  
  // refresh server list on initial load
  refreshServerList();
})
