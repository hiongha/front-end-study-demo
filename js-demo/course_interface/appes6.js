// es5的时候没有class，可以使用prototype
// 课程 类 ，相当于把所有从form表单中提取的数据放到一个”类“中，也就是把数据变得更规矩
class Course {
    constructor(title,link,isbn){
        this.title = title;
        this.link = link;
        this.isbn = isbn;
    }
}

// UI类
class UI {
    addCourseToList(course){
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

    showAlert(message,className){
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

    clearFields(){
        document.getElementById("title").value = "";
        document.getElementById("isbn").value = "";
    }

    deleteCourse(target){
        if (target.className == "delete"){
            // 找到父级元素(td)的父级元素(tr)，并删除
            // 假设添加了三个课程虽然她们的e.target内容打印出来都是一样的，且className也都为"delete"，但是其实e中记录着其他的信息，这就是为什么只有被点击的行被删掉了，而其他两行没有被删掉的原因。
            target.parentElement.parentElement.remove();
            // 弹窗提示
            
        }
    }
}    

// 缓存类
class Store {
    // 静态方法，取出缓存
    static getCourses(){
        let courses;
        if (localStorage.getItem('courses') == null){
            courses = [];
        }else{
            courses = JSON.parse(localStorage.getItem('courses'));
                // 难点：courses中的内容是个字符串，JSON.parse：双引号包裹的列表->列表
                // localStorage.getItem("courses")的内容为：
                // "[{"title":"的发射点","link":"https://imissu.ke.qq.com","isbn":"十大"},{"title":"富士达","link":"https://imissu.ke.qq.com","isbn":"的说法啊"}]"
                // 也就是courses的值是一个被转换成字符串形式的列表，列表的每个元素是一个字典
        }
        return courses;
    }

    // 展示缓存
    static displayCourses(){
        const courses = Store.getCourses();
        courses.forEach((course) => {
            // 新知识点：forEach的用法
            const ui = new UI();
            ui.addCourseToList(course);
        })
    }

    // 存入缓存
    static addCourse(course){
        const courses = Store.getCourses(); //获取localStorage中的courses，如果有则返回courses，没有则返回空列表
        courses.push(course);
        localStorage.setItem('courses',JSON.stringify(courses));
                // 难点：需要将列表转换成字符串后才能作为键值对中的值存入字典中
    }

    // 删除缓存
    // 如果只不删除缓存中的数据，则在刷新的时候，缓存中的数据会被displayCourses数据重新加载出来
    static removeCourse(isbn){
        const courses = Store.getCourses();
        courses.forEach((course,index) => {
                    // 新知识点：course,index相当于python中的enumerate出的内容
            if (course.isbn == isbn){
                courses.splice(index,1);
            }
        });

        // 删掉缓存列表中的一个数据后，还要把courses重新存入
        localStorage.setItem("courses",JSON.stringify(courses))
    }

}

// 为了展示缓存中的内容，添加DOM加载事件
document.addEventListener("DOMContentLoaded",Store.displayCourses);


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
        // 添加缓存
        Store.addCourse(course);
        // 弹出提醒
        ui.showAlert("添加成功！","success");
        // 清除表单
        ui.clearFields();
    }

    e.preventDefault(); //阻止默认事件
})

// 点击X号删除课程
// 对整个course-list添加click事件，这样它的所有子元素都可以触发click事件
document.getElementById("course-list").addEventListener('click',(e) => {
                        // es6中可以使用箭头符号代替function关键字
    console.log(e);  // e是事件,是一个字典，包含非常多的信息
    console.log(e.target);  // target是e的一个属性，但是在e的字典中本身也是一个复杂的内容，
                            // 只是e.targetdayinchulai
    //e.preventDefault();
    // 初始化UI
    const ui = new UI();
    // 删除
    ui.deleteCourse(e.target);
    ui.showAlert('删除成功！','success');
    console.log(e.target.parentElement.previousElementSibling);
    Store.removeCourse(e.target.parentElement.previousElementSibling.textContent);
})

