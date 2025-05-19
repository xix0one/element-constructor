"use strict";

let right_panel = document.getElementById("right");
let left_panel = document.getElementById("left");

// download from localStorage 

(function load_body() {
    const elems = localStorage.getItem('data');
    if (elems) {
        right_panel.innerHTML = elems;
        right_panel.style.width = localStorage.getItem("width");
        right_panel.style.height = localStorage.getItem("height");
        print_HTML_code();
    } else {
        save();
    }
})();

// --------------------------


// help text ----------------

function print_HTML_code() {
    let code = document.getElementById("code");
    code.textContent = right_panel.innerHTML.replace(/></g, ">\n<");
}

// --------------------------


// styles added elems -------

function start_button_style_menu(event) {
    
    event.target.style.borderColor = "red";
    print_HTML_code();
}

function start_div_style_menu(event) {
    print_HTML_code();
}

// --------------------------


// add elems ----------------

function add_button() {
    let btn = document.createElement("button");
    btn.textContent = "button";
    btn.addEventListener("click", start_button_style_menu);
    right_panel.append(btn);
}

function add_div() {
    let div = document.createElement("div");
    div.style.border = "1px solid black";
    div.style.height = "120px";
    div.style.width = "130px";
    div.addEventListener("click", start_div_style_menu);
    right_panel.append(div);
}

// --------------------------


// add controls -------------

function clear() {
    localStorage.removeItem('data');
    document.location.reload();
}

function save() {
    const right_panel_height = right_panel.style.height;
    const right_panel_width = right_panel.style.width;

    localStorage.setItem("data", right_panel.innerHTML);
    localStorage.setItem("height", right_panel_height);
    localStorage.setItem("width", right_panel_width);
}

function add_event(el, control) {
    el.addEventListener("click", function() {
        if (control === "addbutton") add_button();
        else if (control === "clear") clear();
        else if (control === "save") save();
        else if (control === "add_div") add_div();

        print_HTML_code();
    });
}

function add_button_control(text, id, control_type) {
    let element = document.createElement("button");
    element.textContent = text;
    element.id = id;
    add_event(element, control_type);
    return element;
}

function add_main_controls() {
    left_panel.append(add_button_control("add button", "button_addbuttons", "addbutton"));
    left_panel.append(add_button_control("add div", "div", "add_div"));
    left_panel.append(add_button_control("clear", "clear", "clear"));
    left_panel.append(add_button_control("save", "save", "save"));
}

add_main_controls();

// --------------------------