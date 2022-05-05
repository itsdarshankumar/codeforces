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
  const url = "https://codeforces.com/api/user.rating?handle=";
  await axios
    .get(url + handle)
    .then((res) => {
      let ratingdata = [];
      let ratingcat = [];
      const result = res.data.result;
      console.log(res.data);
      let bool = 0;
      if (result.length > 12) {
        bool = 1;
        for (i = 0; i < 12; i++) {
          ratingdata[i] = res.data.result[result.length - 12 + i].newRating;
          ratingcat[i] = res.data.result[result.length - 12 + i].contestName;
        }
      } else {
        for (i = 0; i < result.length; i++)
          ratingdata[i] = res.data.result[i].newRating;
        ratingcat[i] = res.data.result[i].contestName;
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
            contest +
            `<tr> <td>${ratingcat[i]}</td> <td>${ratingdata[i]}</td></tr>`;
        }
      } else {
        for (i = 0; i < result.length; i++) {
          contest =
            contest +
            `<tr> <td>${ratingcat[i]}</td> <td>${ratingdata[i]}</td></tr>`;
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
  await axios
    .get(url + handle)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("3");
};
//comment
const comment = async (blogentryid) => {
  const url = "https://codeforces.com/api/blogEntry.comments?blogEntryId=";

  await axios
    .get(url + blogentryid)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

async function toggleShow() {
  var el = document.getElementById("box");
  const handle = el.value;
  console.log(handle);
  await userinfo(handle);
  await user_rating(handle);
  await userblog(handle);
  console.log("done");
}
