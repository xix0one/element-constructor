"use strict";

let right_panel = document.getElementById("right");
let left_panel = document.getElementById("left");
let targets_text = [];
let target_blocks = [];

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

function delete_match(item, index) {
    item[index].remove();
    print_HTML_code();
    item.splice(index, 1);
}

function delete_targets(event) {
    for (let i = targets_text.length - 1; i >= 0; --i) {
        if (event.key === "Delete" && targets_text[i].style.border) {
            delete_match(targets_text, i);
        }
    }
    for (let i = target_blocks.length - 1; i >= 0; --i) {
        if (event.key === "Delete" && target_blocks[i].style.outline) {
            delete_match(target_blocks, i);
        }
    }
    document.removeEventListener("keydown", delete_targets);
    left_panel.innerHTML = "";
    create_left_menu();
}

function choose_text(event) {
    let current_text = event.target;
    
    if (current_text.style.border) {
        current_text.style.border = "";
        document.removeEventListener("keydown", delete_targets);
        let index = targets_text.indexOf(current_text);
        targets_text.splice(index, 1);
    } else {
        current_text.style.border = "1px solid red";
        document.addEventListener("keydown", delete_targets);
        targets_text.push(current_text);
    }
}

function rgbToHex(rgb) {
    const c = document.createElement('canvas').getContext('2d');
    c.fillStyle = rgb;
    return c.fillStyle;
}

function back_default_left_panel(current_block) {
    current_block.style.outline = "";
    document.removeEventListener("keydown", delete_targets);
    let index = target_blocks.indexOf(current_block);
    target_blocks.splice(index, 1);
    left_panel.innerHTML = "";
    create_left_menu();
}

function change_left_panel(current_block) {
    left_panel.innerHTML = "";

    let background_color = create_color_panel(
        "block_color_panel", 
        "input_background_color", 
        "-background", 
        [rgbToHex(current_block.style.backgroundColor), current_block]
    );
    left_panel.append(background_color);

    // add size, text, text color, shadow?, border color, border radius, height
    // width

    let close = document.createElement('button')
    close.textContent = "close";
    close.addEventListener("click", function() {
        back_default_left_panel(current_block);
        print_HTML_code();
    });
    left_panel.append(close);
}

function choose_block(event) {
    let current_block = event.target;

    if (current_block.style.outline) {
        back_default_left_panel(current_block);
    } else {
        for (let i = 0; i < target_blocks.length; ++i) {
            target_blocks[i].style.outline = "";
        }
        target_blocks = [];

        current_block.style.outline = "2px dashed green";
        document.addEventListener("keydown", delete_targets);
        target_blocks.push(current_block);
        change_left_panel(current_block);
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

    let border_color = document.getElementById("input_border_color").value;
    let border_size = document.getElementById("border_size").value;
    el.style.border = border_size 
        ? `${border_size}px solid ${border_color}`
        : `1px solid ${border_color}`;

    let border_radius = document.getElementById("border_radius").value;
    el.style.borderRadius = border_radius
        ? el.style.borderRadius = `${border_radius}px`
        : el.style.borderRadius = "0px";

    let width_block = document.getElementById("width_block").value;
    el.style.width = width_block
        ? el.style.width = `${width_block}px`
        : el.style.width = `70px`;

    let height_block = document.getElementById("height_block").value;
    el.style.height = height_block
        ? el.style.height = `${height_block}px`
        : el.style.height = `40px`;

    el.style.color = document.getElementById("input_textinblock_color").value;
    el.style.backgroundColor = document.getElementById("input_background_color").value;

    el.addEventListener("click", choose_block);

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

function create_color_panel(id_div, id_inner_div, description, info) {
    let div = document.createElement("div");
    div.id = id_div;
    let input = document.createElement("input");
    input.type = "color";
    input.id = id_inner_div;

    if (info) {
        input.value = info[0];
        input.addEventListener("change", function() {
            info[1].style.backgroundColor = event.target.value;
        });
    }

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
    inner_div.append(create_size_panel("width_block", "width px (70px)"));
    inner_div.append(create_size_panel("height_block", "height px (40px)"));
    inner_div.append(create_size_panel("border_size", "border size px (1px)"));
    inner_div.append(create_size_panel("border_radius", "border radius px (0px)"));
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