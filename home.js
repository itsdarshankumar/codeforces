const userinfo = async (handle) => {
  const url = "https://codeforces.com/api/user.info?handles=";
  await axios
    .get(url + handle)
    .then((res) => {
      const result = res.data.result[0];
      console.log(result);
      const dp = document.getElementById("dp");
      dp.innerHTML = `<img src="${result.avatar}" alt="avatar">`;
      document.getElementById("place").innerText =
        "Place: " + result.city + ", " + result.country;
      document.getElementById("name").innerText =
        "Name: " + result.firstName + " " + result.lastName;
      document.getElementById("handle").innerText = "Handle: " + result.handle;
      document.getElementById("rank").innerText = "Rank: " + result.rank;
      document.getElementById("rating").innerText = "Rating: " + result.rating;
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("1");
};

//rating api
const user_rating = async (handle) => {
  console.log(handle);
  const url = "https://codeforces.com/api/user.rating?handle=";
  await axios
    .get(url + handle)
    .then((res) => {
      let ratingdata = [];
      let ratingcat = [];
      let rank = [];
      const result = res.data.result;
      console.log(res.data);
      let bool = 0;
      if (result.length > 12) {
        bool = 1;
        for (i = 0; i < 12; i++) {
          ratingdata[i] = res.data.result[result.length - 12 + i].newRating;
          ratingcat[i] = res.data.result[result.length - 12 + i].contestName;
          rank[i] = res.data.result[result.length - 12 + i].rank;
        }
      } else {
        for (i = 0; i < result.length; i++)
          ratingdata[i] = res.data.result[i].newRating;
        ratingcat[i] = res.data.result[i].contestName;
        rank[i] = res.data.result[i].rank;
      }
      console.log(ratingdata);
      var chart = new Highcharts.Chart({
        chart: {
          renderTo: "ratingchart",
          marginBottom: 80,
        },
        title: {
          text: "Rating Curve",
        },
        xAxis: {
          categories: ratingcat,
          labels: {
            rotation: 90,
          },
        },

        series: [
          {
            data: ratingdata,
          },
        ],
      });
      const heading = "<tr><th>Contest</th><th>Rank</th></tr>";
      let contest = "";
      if (bool) {
        for (i = 0; i < 12; i++) {
          contest =
            contest + `<tr> <td>${ratingcat[i]}</td> <td>${rank[i]}</td></tr>`;
        }
      } else {
        for (i = 0; i < result.length; i++) {
          contest =
            contest + `<tr> <td>${ratingcat[i]}</td> <td>${rank[i]}</td></tr>`;
        }
      }

      document.getElementById("contest").innerHTML = heading + contest;
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("2");
};

//blog
const userblog = async (handle) => {
  const url = " https://codeforces.com/api/user.blogEntries?handle=";
  let blogentryId;
  await axios
    .get(url + handle)
    .then((res) => {
      console.log(res.data);
      document.getElementById(
        "blog"
      ).innerHTML = `Tag ${res.data.result[0].title}`;
      blogentryId = res.data.result[0].id;
    })
    .catch((err) => {
      console.log(err);
    });
  await comment(blogentryId);
  console.log("3");
};
//comment
const comment = async (blogentryid) => {
  const url = "https://codeforces.com/api/blogEntry.comments?blogEntryId=";

  await axios
    .get(url + blogentryid)
    .then((res) => {
      console.log(res.data);
      document.getElementById("comment").innerHTML =
        `Comments: <br> Handle: ${res.data.result[0].commentatorHandle}` +
        res.data.result[0].text;
    })
    .catch((err) => {
      console.log(err);
    });
};
//friends
const friends = async () => {
  const url = "https://codeforces.com/api/user.friends?onlyOnline=true&apiKey=";
  const allurl =
    "https://codeforces.com/api/user.friends?onlyOnline=false&apiKey=";
  const api_key = ""
  const api_secret = "";
  const time = Math.floor(Date.now() / 1000);
  console.log(time);
  const tohash = `654321/user.friends?apiKey=${api_key}&onlyOnline=true&time=${time}#${api_secret}`;
  const offlinetohash = `654321/user.friends?apiKey=${api_key}&onlyOnline=false&time=${time}#${api_secret}`;
  const onlinehashed = await sha512(tohash);
  const offlinehashed = await sha512(offlinetohash);
  let all;
  let friends = "";
  let offlinefriends = "";
  await axios
    .get(allurl + api_key + "&time=" + time + "&apiSig=654321" + offlinehashed)
    .then((res) => {
      console.log(res.data);
      all = res.data.result;
    })
    .catch((err) => {
      console.log(err);
    });

  await axios
    .get(url + api_key + "&time=" + time + "&apiSig=654321" + onlinehashed)
    .then((res) => {
      console.log(res.data);
      res.data.result.forEach((element) => {
        friends =
          friends + `<tr><td  style="color:green;">${element}</td></tr>`;
      });
      all = all.filter(function (el) {
        return friends.indexOf(el) < 0;
      });
      all.forEach((element) => {
        offlinefriends = offlinefriends + `<tr><td >${element}</td></tr>`;
      });
    })
    .catch((err) => {
      console.log(err);
    });
  document.getElementById("onlinefriends").innerHTML =
    `<tr><th>Friends</th></tr> ` + friends + offlinefriends;
  var lis = document.querySelectorAll(".data tr td");
  lis.forEach(function (el) {
    el.addEventListener("click", onClick, false);
  });
  console.log(lis);
};

async function sha512(str) {
  return crypto.subtle
    .digest("SHA-512", new TextEncoder("utf-8").encode(str))
    .then((buf) => {
      return Array.prototype.map
        .call(new Uint8Array(buf), (x) => ("00" + x.toString(16)).slice(-2))
        .join("");
    });
}

async function toggleShow() {
  var el = document.getElementById("box");
  const handle = el.value;
  console.log(handle);
  await userinfo(handle);
  await user_rating(handle);
  await userblog(handle);
  await friends();
  console.log("done");
}

function onClick(e) {
  var td = e.currentTarget;
  console.log(td);
  console.log(td.innerText);
  redirect(td.innerText);
}
async function redirect(handle) {
  console.log(handle);
  await userinfo(handle);
  await user_rating(handle);
  await userblog(handle);
  await friends();
  console.log("done");
}
