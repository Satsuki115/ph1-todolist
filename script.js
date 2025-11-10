"use strict";
const todolist=[]; //グローバル関数の定義//
let editingIndex = null; //グローバル関数で定義//
document.addEventListener('DOMContentLoaded', function(){ //htmlからの要素を取得//
const inputElement =document.getElementById('new-task-input');
const buttonElement = document.getElementById('add-task-button');
const ul = document.getElementById('task-list');

const renderTodos = function(){ //rendertodoはtodolistの内容をもとにliを作り直し//
    ul.innerHTML = ''; //ulはDOM内で定義されているので同じスコープ内でしかよびだせない//
    //リストを殻にする//
    todolist.forEach((task,index) => { //todolist配列を順番に処理⁄/
        let listItem = document.createElement('li');  //新しいHTML要素を作成//
        listItem.textContent = task.text;
        const listItemWithButtons = createTodoElement(task, index); //タスクとインデックスを渡す//
        ul.appendChild(listItemWithButtons); //渡されたli要素をulの子要素とする//
    });
};

if (buttonElement && inputElement){
    buttonElement.addEventListener('click',function(){ //追加ボタンにクリックイベントを設定//
        if(editingIndex !==null){ //editindexになんらかのindexが当てはめられている場合//
            updateTodo(editingIndex, inputElement.value, todolist);//タスクの変更を担当するupdatetodoを呼び出し→()はupdatetodoに渡す引数を特定//
        }else{
        addtodo(inputElement.value, todolist);//ユーザーが入力した値とtodoデータ配列todolistをaddtodo関数に渡して呼び出し//
        }

        renderTodos();//画面の描画を担当するrendertodoを呼び出し//
        console.log("現在のToDoリスト",todolist);
        inputElement.value = '';//inputValueを空にして入力欄をクリア//
        buttonElement.textContent = '追加';

        
    });
}else{
    console.log("エラー")
}
const toggleCompleted = (index) => {
   const targretTask = todolist[index]; //データ操作関数を呼び出し、タスク状態を切り替え//
   const isBecomingCompleted = !targretTask.completed;//completedプロパティが切り替わる瞬間を判定→trueかfalseかがisBecomingCompletedに入る//
   targretTask.completed = !targretTask.completed; //completedプロパティのtrueとfalseを反転//
   
   

    if(isBecomingCompleted){//trueの時のみアラート//
    Swal.fire({ //sweetAlert2実装のため、alertでなくこちらで表記//
            title: '完了!',
            text: `to-doが完了しました。`, // メッセージを表示
            icon: 'success',
        });
   };
   
    renderTodos();//画面を最新の状態に再描画//
   console.log("タスクの状態をきりかえました");   
}

// const textValue = inpitValue.trim();
const addtodo = function(inputValue, array){
const textValue = inputValue.trim(); //trimで文字列の空白を削除した関数textValueを定義//
    if(inputValue && inputValue.trim()!== ""){ //inputValueがnullやundefined出ないことを確認、前後の空白を削除した結果がからの文字列でないことを確認//
        const newtodo = { //newtodoを定義し、オブジェクトを作成//
            text:textValue,//textキーを作成、値はtextValue(文字列)//
            completed:false,//completedキーを作成、値はブール値のfalse//
        };
        array.push(newtodo); //配列に追加//
        console.log("新しいタスクを追加しました");
    }else{
        console.log("タスクは追加されませんでした");
    }

};

const createTodoElement = (todo, index) =>{ //todolistからタスクのオブジェクトを取得 indexは配列内でのタスクの位置を記す値→タスクの状態を切り替えるのに必要//
    let listItem = document.createElement('li'); //liをブラウザ上に作成//
    listItem.setAttribute('data-index',index);//li要素にカスタムデータ属性data-indexを設定し配列のindexを格納//
    listItem.textContent = todo.text;//タスクオブジェクトからタスクの内容（文字列）を取得し、liのテキストとして設定//

    let completeButton = document.createElement('button');//buttonをブラウザ上に作成//
    completeButton.textContent =todo.completed? 'Undo':'Complete';//todo.completedの状態がtrueならUndoをfalseならcompleteを表示//
    completeButton.className = 'mx-2 px-2 py-1 bg-blue-500 hover hover:bg-blue-700 text-white font-bold text-center rounded w-40';//tailwindのクラス指定//
    completeButton.addEventListener('click',function(event){//ボタンがクリックされた時の処理を定義//
        const listItem = event.target.closest('li');//クリックされたボタンから最も近い親のli要素を取得//
        const taskIndex = listItem.getAttribute('data-index');//liからdata-indexを取得//
        const indexToManipulate = parseInt(taskIndex,10);//取りだしたindex（文字列）を数値（１０進数）に変換//
        toggleCompleted(indexToManipulate);//変換したindexを私、タスクの完了状態を切り替える関数を呼び出し//
        // alert("to-doが完了しました");
    });

    let editButton = document.createElement('button');//buttonをブラウザ上に生成//
    editButton.textContent = 'Edit';//buttonに表示するテキストを設定//
    editButton.className = 'bg-yellow-500 hover:bg-yellow-700 mx-2 px-2 py-1 text-white font-bold text-center rounded w-40';//tailwindでクラス指定//

    editButton.addEventListener('click',function(event){//clickeventを定義//
        const listItem = event.target.closest('li');//クリックされたボタンから最も近い親のli要素を取得//
        const taskIndex = listItem.getAttribute('data-index');//liからdata-indexを取得//
        const indexToMainpulate = parseInt(taskIndex,10);//取りだしたindex（文字列）を数値（１０進数）に変換//

        const todoEdit = todolist[indexToMainpulate];//todoeditにindexを特定したindexToMainpulateを渡す//

        inputElement.value = todoEdit.text;//todoEditで受け取ったindexのテキストを入力欄(inputElement)に入れる//
        editingIndex = indexToMainpulate;//indexToMainpulateで特定したタスクのindexをeditingIndexに渡す//
        buttonElement.textContent = '更新';//入力ボタンの文字を追加から更新に変更//
        inputElement.focus();//inputelementをアクティブにする→ユーザはカーソルを入れなくてもキーボードで入力できる状態に//

    });

    let deleteButton = document.createElement('button');//buttonをブラウザ上に作成//
    deleteButton.textContent ='Delete';//buttonに表示するテキストを設定//
    deleteButton.className = 'bg-red-500 hover:bg-red-700 mx-2 px-2 py-1 text-white font-bold text-center rounded w-40';//tailwindでクラス指定//

    deleteButton.addEventListener('click',function(event){//ここでclickevetを定義//
        const listItem = event.target.closest('li');//クリックされたボタンから最も近い親のli要素を取得//
        const taskIndex = listItem.getAttribute('data-index');//liからdata-indexを取得//
        const indexToManipulate = parseInt(taskIndex,10);//取りだしたindex（文字列）を数値（１０進数）に変換//

        deleteTodo(indexToMainpulate);//deleteTodoにindexを特定したindexToMainpulateを渡す//
    });

    let buttonContainer = document.createElement('div');//divをブラウザ上に作成、buttonContainerという変数に格納//
    buttonContainer.appendChild(completeButton);//buttonContainerの子要素にcompleteButtonを格納//
    buttonContainer.appendChild(editButton);//buttonContainerの子要素にeditButtonを格納//
    buttonContainer.appendChild(deleteButton);//buttonContainerの子要素にdeleteButtonを格納//
    
    listItem.appendChild(buttonContainer);//ボタンとタスクテキストが組み込まれた完成形のliを呼び出し//
    return listItem;//li要素を呼び出し元のrendertodo(listItemはrendertodoで定義)に返す//

};

const deleteTodo = (index) => {
    todolist.splice(index, 1); //indexToMainpulateから渡されたindexのタスクを削除//
    renderTodos();//画面の再描画を指示//
    console.log('タスクを削除しました');
};

const updateTodo = (index,newText) => {//update関数を定義 newTextは新しく入力されたテキスト//
    const trimmedText =  newText.trim();//入力された文字列の前後にある空白の削除//

    if(trimmedText ===""){//入力されたテキストが空の場合→それ以降の処理をすべて中断（早期リターン）//
        console.log("更新内容が空です");
        return;//早期リターンのためelseを指定しなくてよい//
    };

    todolist[index].text = trimmedText;//入力されたテキストにtodolist配列を更新し、trimmedtextで上書き//
    editingIndex = null;//アプリケーションを通常モードに戻す//

    console.log("タスクを更新しました");


};


});//html読み込みからのすべてをローカルスコープに指定　削除しない！！//
