"use strict";

let right_panel = document.getElementById("right");
let left_panel = document.getElementById("left");
let targets_text = [];

function print_HTML_code() {
    let code = document.getElementById("code");
    code.textContent = right_panel.innerHTML.replace(/></g, ">\n<");
}

function add_el_topanel(el) {
    right_panel.append(el);
    print_HTML_code();
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

function delete_target_text(event) {
    for (let i = targets_text.length - 1; i >= 0; --i) {
        if (event.key === 'Delete' && targets_text[i].style.border) {
            targets_text[i].remove();
            print_HTML_code();
            targets_text.splice(i, 1);
        }
    }
}

function choose_text(event) {
    let current_text = event.target;
    
    if (current_text.style.border) {
        current_text.style.border = "";
        document.removeEventListener("keydown", delete_target_text);
        const index = targets_text.indexOf(current_text);
        targets_text.splice(index, 1);
    } else {
        current_text.style.border = "1px solid red";
        document.addEventListener("keydown", delete_target_text);
        targets_text.push(current_text);
    }
}

function create_text_el(select_value, input) {
    if (!input.value.trim()) {
        input.style.borderColor = "red";
        return; 
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

        add_el_topanel(el);

        el.addEventListener("click", choose_text);
    }
}

function create_block_el(select_value, input) {
    let el = document.createElement(select_value);
    el.textContent = input.value;

    let bd_color = document.getElementById("input_border_color").value;

    let border_size = document.getElementById("border_size").value;
    if (border_size) {
        el.style.border = `${border_size}px solid ${bd_color}`;
    } else {
        el.style.border = `1px solid ${bd_color}`;
    }

    let border_radius = document.getElementById("border_radius").value;
    if (border_radius) {
        el.style.borderRadius = `${border_radius}px`;
    } else {
        el.style.borderRadius = "0px";
    }

    el.style.color = document.getElementById("input_textinblock_color").value;
    el.style.height = "40px";
    el.style.width = "70px";
    el.style.backgroundColor = document.getElementById("input_background_color").value;

    el.addEventListener("click", function() {
        print_HTML_code();
    });

    add_el_topanel(el);
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

function create_color_panel(id_div, id_inner_div, description) {
    let div = document.createElement("div");
    div.id = id_div;
    let input = document.createElement("input");
    input.type = "color";
    input.id = id_inner_div;
    div.append(input);
    div.append(description);

    return div;
}

function create_size_panel(input_id, inner_text) {
    let input = document.createElement("input");
    input.type = "number";
    input.id = input_id;
    input.placeholder = inner_text;
    return input;
}

function create_text_setting_panel() {
    let inner_div = document.createElement("div");

    inner_div.append(create_color_panel("text_color_panel", "input_color", "-text color"));
    inner_div.append(create_size_panel("input_size", "rem (3 default)"));

    let div_boxes = document.createElement("div");
    create_checkbox(div_boxes, ["bold", "italic", "underline"]);
    inner_div.append(div_boxes);

    return inner_div;
}

function create_block_setting_panel() {
    let inner_div = document.createElement("div");
    inner_div.append(create_color_panel("block_color_panel", "input_background_color", "-background"));
    inner_div.append(create_color_panel("block_color_panel", "input_border_color", "-border color"));
    inner_div.append(create_color_panel("block_color_panel", "input_textinblock_color", "-text color"));
    inner_div.append(create_size_panel("border_size", "border size px (default 1px)"));
    inner_div.append(create_size_panel("border_radius", "border radius px (default 0px)"));
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

    if (idf === "block") {
        div.append(create_block_setting_panel());
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