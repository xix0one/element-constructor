"use strict";


// download from localStorage 

(function load_body() {
    const elems = localStorage.getItem('data');
    let right_panel = document.getElementById("right");
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
    let right_panel = document.getElementById("right");
    let code = document.getElementById("code");
    code.textContent = right_panel.innerHTML;
}

// --------------------------


// add controls -------------

function add_button() {
    let btn = document.createElement("button");
    btn.textContent = "button";
    right.append(btn);
    print_HTML_code();
}

function clear() {
    localStorage.removeItem('data');
    document.location.reload();
}

function save() {
    const right_panel = document.getElementById("right");
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
    });
}

function add_element_control(type, text, id, control_type) {
    let element = document.createElement(type);
    element.textContent = text;
    element.id = id;
    add_event(element, control_type);
    return element;
}

function add_main_controls() {
    let left = document.getElementById("left");

    left.append(add_element_control("button", "add button", "button_addbuttons", "addbutton"));
    left.append(add_element_control("button", "clear", "clear", "clear"));
    left.append(add_element_control("button", "save", "save", "save"));
}

add_main_controls();

// --------------------------