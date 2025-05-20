"use strict";

let right_panel = document.getElementById("right");
let left_panel = document.getElementById("left");

function print_HTML_code() {
    let code = document.getElementById("code");
    code.textContent = right_panel.innerHTML.replace(/></g, ">\n<");
}

function remove_panel(idf, main_text) {
    let remove_current_panel = document.getElementById("setting_panel " + idf);
    let select = document.getElementById(idf + " select");
    select.value = main_text;
    remove_current_panel.remove();
}

function check_check_boxes(el) {
    let bold = document.getElementById("bold");
    let italic = document.getElementById("italic");
    let underline = document.getElementById("underline");

    if (bold.checked) {
        el.style.fontWeight = "bold";
    }
    if (italic.checked) {
        el.style.fontStyle = "italic";
    }
    if (underline.checked) {
        el.style.textDecoration = "underline";
    }
}


// function choose_text(event) {
//     let target_text = event.target;

//     function delete_target_text(event) {
//         if (event.key === 'Delete') {
//             target_text.remove();
//         }
//         print_HTML_code();
//         document.removeEventListener("keydown", delete_target_text);
//     }
    
//     if (target_text.style.border) {
//         target_text.style.border = "";
//         document.removeEventListener("keydown", delete_target_text);
//     } else {
//         target_text.style.border = "1px solid red";
//         document.addEventListener("keydown", delete_target_text);
//     }
// }

function create_text_el(select_value, input) {
    if (!input.value) {
        input.style.borderColor = "red";
    } else {
        input.style.borderColor = "black";
        let el = document.createElement(select_value);
        el.textContent = input.value;
        el.style.color = document.getElementById("input_color").value;

        let size = document.getElementById("input_size").value;
        if (size) {
            el.style.fontSize = (size + "rem");
        } else {
            el.style.fontSize = "3rem";
        }

        check_check_boxes(el);

        right_panel.append(el);
        print_HTML_code();

        // el.addEventListener("click", choose_text);
    }
}

function create_block_el(select_value, input) {
    let el = document.createElement(select_value);
    el.textContent = input.value;
    el.style.border = "1px solid black";
    el.style.height = "40px";
    el.style.width = "70px";

    el.addEventListener("click", function() {
        print_HTML_code();
    });

    right_panel.append(el);
    print_HTML_code();
}

function default_form_setting(idf, div) {
    div.id = "setting_panel " + idf;

    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "text inside";
    input.id = "input " + idf;
    div.append(input);
}

function deafult_button_setting(idf, select_value, main_text, div) {
    let btn = document.createElement("button");
    btn.textContent = "create";

    btn.addEventListener("click", function() {
        let input = document.getElementById("input " + idf);
        if (idf === "text") {
            create_text_el(select_value, input);
        } else if (idf === "block") {
            create_block_el(select_value, input);
        }
    });

    div.append(btn);

    let btn_close = document.createElement("button");
    btn_close.textContent = "close";

    btn_close.addEventListener("click", function() {
        remove_panel(idf, main_text);
    });

    div.append(btn_close);
}

function create_checkbox(div_boxes, boxes) {
    for (let i = 0; i < boxes.length; ++i) {
        let label = document.createElement("label");
        let box = document.createElement("input");
        box.type = "checkbox";
        box.id = boxes[i];
        label.append(box);
        label.append(" " + boxes[i]);
        div_boxes.append(label);
    }
}

function create_text_setting_panel() {
    let inner_div = document.createElement("div");

    let input_color = document.createElement("input");
    input_color.type = "color";
    input_color.id = "input_color";
    inner_div.append(input_color);

    let input_size = document.createElement("input");
    input_size.type = "number";
    input_size.id = "input_size";
    input_size.placeholder = "rem (3 default)";
    inner_div.append(input_size);

    let div_boxes = document.createElement("div");
    create_checkbox(div_boxes, ["bold", "italic", "underline"]);
    inner_div.append(div_boxes);

    return inner_div;
}

function create_setting_panel(event, idf, main_text) {
    const select_value = event.target.value;

    let setting_panel = document.getElementById(idf);

    let check_prev_panel = document.getElementById(("setting_panel " + idf));
    if (check_prev_panel) {
        check_prev_panel.remove();
    }

    let div = document.createElement("div");
    default_form_setting(idf, div);

    if (idf === "text") {
        div.append(create_text_setting_panel());
    }

    deafult_button_setting(idf, select_value, main_text, div);

    setting_panel.append(div);
}

function create_drop_down_list(main_text, options, idf) {
    let div = document.createElement("div");
    div.id = idf;

    let select = document.createElement("select");
    select.id = idf + " select";

    let placeholder = new Option(main_text);
    placeholder.disabled = true;
    placeholder.selected = true;
    select.add(placeholder);

    for (let i = 0; i < options.length; ++i) {
        let option = new Option(options[i]);
        select.add(option);
    }

    select.addEventListener('change', function(event) {
        create_setting_panel(event, idf, main_text);
    });
    
    div.append(select);
    return div;
}

function create_left_menu() {
    left_panel.append(create_drop_down_list("text elements", ["h1", "h2", "h3", "p", "span"], "text"));
    left_panel.append(create_drop_down_list("block elements", ["div", "header", "footer", "aside", "table"], "block"));
}

create_left_menu();
