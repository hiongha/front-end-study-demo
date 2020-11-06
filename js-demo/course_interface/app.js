// es5的时候没有class，可以使用prototype
// 课程构造函数，相当于把所有从form表单中提取的数据放到一个”类“中，也就是把数据变得更规矩
function Course(title,link,isbn){
    this.title = title;
    this.link = link;
    this.isbn = isbn;
}

// UI构造函数
function UI(){} //UI中什么都不用写，可以用prototype追加方法
                //当前的界面做出哪些反应

// 添加方法
//添加课程信息到table列表中
UI.prototype.addCourseToList = function(course){
    // 想要将数据插入到tbody中，所以先获取"course-list"
    const list = document.getElementById("course-list");
    // 在tbody中追加一个tr元素
    const row = document.createElement("tr");
    // tr元素有了，还要在元素中添加数据
    row.innerHTML = `
        <td>${course.title}</td>
        <td><a href="${course.link}">查看</a></td>
        <td>${course.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
    `; // 使用模板语法

    // 将row中的内容追加到"list"变量中
    list.appendChild(row);
}

// 弹窗提醒
UI.prototype.showAlert = function(message,className){
    // 要展示的数据放在什么元素里
    const div = document.createElement("div");
    // 给上面的元素添加一个子元素，子元素是文本
    div.appendChild(document.createTextNode(message));
    // 为要展示的元素添加样式，样式在indexl.html的style标签中
    div.className = `alert ${className}`; //alert也是一个类

    // 定位到想要插入的位置
    // 获取父级元素
    const container = document.querySelector(".container");
    // 获取表单
    const form = document.getElementById("course-form");
    // 想要把div插入container和form中，插入DOM
    container.insertBefore(div,form);

    // 清除弹窗内容
    setTimeout(function(){
        document.querySelector(".alert").remove();
    },2000);
}

// 清楚表单
UI.prototype.clearFields = function(){
    document.getElementById("title").value = "";
    document.getElementById("isbn").value = "";
}

// 删除单行课程信息
UI.prototype.deleteCourse = function(target){
    if (target.className == "delete"){
        // 找到父级元素(td)的父级元素(tr)，并删除
        // 假设添加了三个课程虽然她们的e.target内容打印出来都是一样的，且className也都为"delete"，但是其实e中记录着其他的信息，这就是为什么只有被点击的行被删掉了，而其他两行没有被删掉的原因。
        target.parentElement.parentElement.remove();
        // 弹窗提示
        
    }

}

// 添加Submit事件
document.getElementById("course-form").addEventListener("submit",function(e){
        //e是事件对象
        //获取course-form这个元素，对它添加一个submit事件，点击”提交“时，触发function函数
    
    //点击事件发生后首先要获取表单中的数据    
    const title = document.getElementById("title").value,
        link = document.getElementById("link").value,
        isbn = document.getElementById("isbn").value;
        console.log(title,link,isbn);
    
    //让当前的内容插入到DOM中，虽然可以直接写在函数中，但是最好写成面向对象的形式。
    //es5中没有class，但有prototype
        
    //实例化Course
    const course = new Course(title,link,isbn);
    //实例化UI
    const ui = new UI();

    // 检验填入的数据是否符合要求
    if (course.title == '' || course.isbn == ''){
        // 弹出提醒
        ui.showAlert("请填写内容！","error");
    }else{
        // 添加内容
        ui.addCourseToList(course);
        // 弹出提醒
        ui.showAlert("添加成功！","success");
        // 清除表单
        ui.clearFields();
    }

    e.preventDefault(); //阻止默认事件
})

// 点击X号删除课程
// 对整个course-list添加click事件，这样它的所有子元素都可以触发click事件
document.getElementById("course-list").addEventListener('click',function(e){
    console.log(e);  // e是事件,是一个字典，包含非常多的信息
    console.log(e.target);  // target是e的一个属性，但是在e的字典中本身也是一个复杂的内容，
                            // 只是e.targetdayinchulai
    //e.preventDefault();
    // 初始化UI
    const ui = new UI();
    // 删除
    ui.deleteCourse(e.target);
    ui.showAlert('删除成功！','success');
})

