// 縦書きに変換しているので,インライン要素については縦横が反対になることに注意！

// alert("もしも表示画面が大きい場合は、「ctrl」+「―（マイナス）またはマウスホイール」で見やすい大きさに調整してください。")

const se = new Audio();
se.src = "./set.mp3";
const se2 = new Audio();
se2.src = "./reset.mp3";

var dansu = 1;
var mondaisu = 10;
const bangou = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩", "⑪", "⑫", "⑬", "⑭", "⑮", "⑯", "⑰", "⑱", "⑲", "⑳"];
const daimei = ["漢字テスト", "かん字テスト", "かんじテスト"];
const setumeiData = [
  "線を引いた部分を漢字（漢字と送り仮名）で書きましょう。",
  "せんを　ひいた　ぶぶんを　かん字（かん字とおくりがな）で　書きましょう。",
  "線を引いた部分の読みを書きましょう。",
  "せんを　ひいた　かん字の　よみを　書きましょう。",
];
const namaeData = ["年", "組", "名前", "年", "くみ", "なまえ", "ねん", "くみ", "なまえ"];
const thFontSize = "20px";
const thHeight = "50px";
const presetMondaisu = [7, 7, 10, 10, 10, 20];
const presetTitleSelectValue = [2, 1, 1, 1, 0, 0];
const presetNamaeSelectValue = [2, 1, 0, 0, 0, 0];
const presetSetumeiSelectValue = [1, 1, 1, 0, 0, 0];
var divFontSize = "20px";
var dansu = 1;

//初期設定
init();

//初期設定
function init() {
  // --セレクトボックスの作成
  // 表題データのセレクトボックス作成
  for (let i = 0; i < daimei.length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = daimei[i];
    titleSelect.appendChild(option);
  }
  titleSelect.value = 0; //初期値

  // 副題データ　変更のインプットボックス作成
  subTitle.addEventListener("change", () => {
    Fukudai.innerHTML = subTitle.value;
  });

  // 学年・組・名前　変更のデータ作成
  for (let i = 0; i < 3; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `　${namaeData[i * 3]}　${namaeData[i * 3 + 1]}　${namaeData[i * 3 + 2]}（　）`;
    namaeSelect.appendChild(option);
  }
  namaeSelect.value = 0;

  // 説明欄のデータ作成
  for (let i = 0; i < 4; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = setumeiData[i];
    setumeiSelect.appendChild(option);
  }
  setumeiSelect.value = 0;

  // フォントサイズ変更のセレクトボックス作成
  for (let i = 6; i < 50; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    fontSizeSelect.appendChild(option);
  }
  fontSizeSelect.value = 20;
  divFontSize = fontSizeSelect.value + "px";

  // 問題数変更のセレクトボックス作成
  for (let i = 5; i <= 20; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    mondaisuSelect.appendChild(option);
  }
  mondaisuSelect.value = 10;

  // 段数変更のセレクトボックス作成
  for (let i = 1; i <= 2; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i + "だん";
    dansuSelect.appendChild(option);
  }
  dansuSelect.value = 1;

  // イベントの設定一覧
  // フォントサイズ更新
  fontSizeSelect.addEventListener("change", () => {
    divFontSize = fontSizeSelect.value + "px";
    dataUpdate();
  });
  // 問題数更新
  mondaisuSelect.addEventListener("change", () => {
    mondaisu = mondaisuSelect.value;
    dataUpdate();
  });
  // 段数更新
  dansuSelect.addEventListener("change", () => {
    dansu = dansuSelect.value;
    dataUpdate();
  });
  // 学年更新
  grade.addEventListener("change", () => {
    gradeChange(document.radio.grade.value);
  });
  // 表題更新
  titleSelect.addEventListener("change", () => {
    dataUpdate();
  });
  // 年・組・名前更新
  namaeSelect.addEventListener("change", () => {
    dataUpdate();
  });
  // 説明欄更新
  setumeiSelect.addEventListener("change", () => {
    dataUpdate();
  });
  //セーブボタンを押したときの挙動
  document.getElementById("save").addEventListener("click", () => {
    save();
  });
  //セーブボタンを押したときの挙動
  document.getElementById("selfile").addEventListener("click", () => {
    load();
  });


  //学年の変更
  function gradeChange(val) {
    // 学年に応じた　問題数・表題・名前等の設定
    mondaisuSelect.value = presetMondaisu[val - 1];
    mondaisu = presetMondaisu[val - 1];
    titleSelect.value = presetTitleSelectValue[val - 1];
    namaeSelect.value = presetNamaeSelectValue[val - 1];
    setumeiSelect.value = presetSetumeiSelectValue[val - 1];
    dataUpdate();
  }
  dataUpdate();
}

//データのアップデート
function dataUpdate() {
  //表題の変更
  Hyoudai.innerHTML = "　" + daimei[titleSelect.value];
  //学年・組・名前　の変更
  let index = Number(namaeSelect.value);
  namae.innerHTML = `　　　${namaeData[index * 3]}　　${namaeData[index * 3 + 1]}　${namaeData[index * 3 + 2]}（　　　　　　　　　　）`;
  setumei.innerHTML = "　　○　" + setumeiData[setumeiSelect.value];
  //書き取り枠の更新
  createTable();
  check();
}

function createTable() {
  TBL_H.innerHTML = "";
  TBL_L.innerHTML = "";

  if (dansu == 1) {
    var tdWidth = 960 / mondaisu + "px";
    var divWidth = 800 / mondaisu + "px";
    var tdHeight = "320px";
  } else if (dansu == 2) {
    if (mondaisu % 2 == 0) {
      var tdWidth = 960 / (mondaisu / 2) + "px";
      var divWidth = 800 / (mondaisu / 2) + "px";
    } else if (mondaisu % 2 == 1) {
      var tdWidth = 960 / (Math.floor(mondaisu / 2) + 1) + "px";
      var divWidth = 800 / (Math.floor(mondaisu / 2) + 1) + "px";
    }
    var tdHeight = "160px";
  }

  for (let i = 0; i < dansu; i++) {
    if (dansu == 1) {
      var retusu = mondaisu;
    } else if (dansu == 2) {
      if (i == 0) {
        var retusu = mondaisu / 2;
      } else if (i == 1) {
        if (mondaisu % 2 == 0) {
          var retusu = mondaisu / 2;
        } else if (mondaisu % 2 == 1) {
          var retusu = Math.floor(mondaisu / 2);
        }
      }
    }
    for (let j = 0; j < retusu; j++) {
      const tr = document.createElement("tr");
      if (i === 0) {
        TBL_H.appendChild(tr);
      } else if (i === 1) {
        TBL_L.appendChild(tr);
      }
      for (let k = 0; k < 3; k++) {
        switch (k) {
          case 0:
            const th = document.createElement("th");
            if (mondaisu % 2 == 0) {
              th.innerHTML = bangou[j + i * Math.floor(mondaisu / 2)];
            } else if (mondaisu % 2 == 1) {
              th.innerHTML = bangou[j + i * Math.floor(mondaisu / 2 + 1)];
            }
            th.style.fontSize = thFontSize;
            th.style.height = thHeight;
            th.style.textAlign = "center";
            tr.appendChild(th);
            break;
          case 1:
          case 2:
            const td = document.createElement("td");
            tr.appendChild(td);
            td.style.width = tdWidth;
            td.style.height = tdHeight;
            const div = document.createElement("div");
            td.appendChild(div);
            div.style.width = divWidth;
            div.style.height = tdHeight;
            div.style.fontSize = divFontSize;
            div.style.verticalAlign = "middle";
            div.style.display = "table-cell";
            if (k === 1) {
              div.classList.add("question");
            } else if (k === 2) {
              div.style.border = "solid 1px #333";
            }
            break;
        }
      }
    }
  }
}

function check() {
  se.currentTime = 0;
  se.play();
  var text = document.getElementById("srcTextArea").value.replace(/\r\n|\r/g, "\n");
  var lines = text.split("\n");
  var outArray = new Array();

  for (var i = 0; i < lines.length; i++) {
    // 空行は無視する
    if (lines[i] == "") {
      continue;
    }
    outArray.push(lines[i]);
  }

  for (let i = 0; i < mondaisu; i++) {
    let temp = outArray[i] || "";
    let tempAry = temp.split("@");
    let output = "";
    for (let j = 0; j < tempAry.length; j++) {
      if (j % 2 === 0) {
        output = output + tempAry[j];
      } else {
        output = output + "<span style='border-right:1px black double;'>" + tempAry[j] + "</span>";
      }
    }
    document.getElementsByClassName("question")[i].innerHTML = output || "";
  }
  return outArray;
}

function shuffle() {
  se2.currentTime = 0;
  se2.play();
  let temp = [];
  for (let i = 0; i < mondaisu; i++) {
    temp[i] = document.getElementsByClassName("question")[i].innerHTML || "";
  }

  let hairetu = [];
  let arr = [];
  for (let j = 0; j < mondaisu; j++) {
    hairetu[j] = j;
  }
  for (let j = 0; j < mondaisu; j++) {
    arr.push(...hairetu.splice(Math.floor(Math.random() * hairetu.length - 1), 1));
  }
  for (let i = 0; i < mondaisu; i++) {
    document.getElementsByClassName("question")[i].innerHTML = temp[arr[i]] || "";
  }
}


function save() {
  // テキストエリアより文字列を取得
  const txt = document.getElementById("srcTextArea").value;
  if (!txt) {
    return;
  }

  // 文字列をBlob化
  const blob = new Blob([txt], { type: "text/plain" });

  // ダウンロード用のaタグ生成
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  const now = new Date();
  const defaultFileName = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-kanji`;
  const safeFileName = fileName.value || defaultFileName;
  a.download = safeFileName + ".txt";
  a.click();

  // Clean up
  URL.revokeObjectURL(a.href);
}

function load() {
  var obj1 = document.getElementById("selfile");

  //ダイアログでファイルが選択された時
  obj1.addEventListener(
    "change",
    function (evt) {
      var file = evt.target.files[0];
      if (!file) return;

      // ファイルタイプチェック
      if (file.type && !file.type.startsWith('text/')) {
        alert('テキストファイル（.txt）のみ対応しています。');
        return;
      }

      // ファイルサイズチェック（1MB以下）
      const maxSize = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        alert('ファイルサイズが大きすぎます（1MB以下にしてください）。');
        return;
      }

      //FileReaderの作成
      var reader = new FileReader();

      //読込終了後の処理
      reader.onload = function (ev) {
        try {
          var content = reader.result;

          // 基本的な文字列の長さチェック
          const maxLength = 10000; // 約10,000文字まで
          if (content.length > maxLength) {
            if (!confirm(`テキストが長すぎます（${content.length}文字）。最初の${maxLength}文字のみ読み込みますか？`)) {
              return;
            }
            content = content.substring(0, maxLength);
          }

          // HTMLタグやスクリプトの除去
          content = content.replace(/<[^>]*>/g, '');

          // 制御文字の除去（改行とタブ以外）
          content = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

          //テキストエリアに表示する
          document.getElementById("srcTextArea").value = content;
        } catch (error) {
          alert('ファイルの読み込みに失敗しました。正しいテキストファイルを選択してください。');
          console.error('File reading error:', error);
        }
      };

      reader.onerror = function() {
        alert('ファイルの読み込み中にエラーが発生しました。');
      };

      //テキスト形式で読み込む
      reader.readAsText(file, 'UTF-8');
    },
    false
  );
}
