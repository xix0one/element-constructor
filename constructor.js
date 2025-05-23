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
    left_panel.innerHTML = "";
    create_left_menu();
    document.removeEventListener("keydown", delete_targets);
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
}

function back_default_left_panel(current_item, type) {
    document.removeEventListener("keydown", delete_targets);
    if (type == "block") {
        current_item.style.outline = "";
        let index = target_blocks.indexOf(current_item);
        target_blocks.splice(index, 1);
    } else if (type == "text") {
        current_item.style.border = "";
        let index = targets_text.indexOf(current_item);
        targets_text.splice(index, 1);
    }

    left_panel.innerHTML = "";
    create_left_menu();
}

function rgbToHex(rgb) {
    const c = document.createElement('canvas').getContext('2d');
    c.fillStyle = rgb;
    return c.fillStyle;
}

function create_close_button(current_item, type) {
    let close = document.createElement('button')
    close.textContent = "close";
    close.addEventListener("click", function() {
        back_default_left_panel(current_item, type);
        print_HTML_code();
    });

    return close;
}

function start_new_left_panel(current_item) {
    left_panel.innerHTML = "";
    let panel_target_item = document.createElement("div");
    panel_target_item.id = "panel_target_item";

    let text_input = document.createElement("input");
    text_input.type = "text";
    if (current_item.textContent) {
        text_input.value = current_item.textContent;
    } else {
        text_input.placeholder = "enter text";
    }
    text_input.addEventListener("change", function(event) {
        current_item.textContent = text_input.value;
        print_HTML_code();
    });
    panel_target_item.append(text_input);

    return panel_target_item;
}

function check_style_boxes(current_text) {

}

function change_current_text(current_text) {
    let panel_target_item = start_new_left_panel(current_text);

    panel_target_item.append(change_colors(current_text, "input_text_color", "-text color", "color"));
    panel_target_item.append(change_sizes(current_text, "input_size", "font-size", "rem"));

    create_checkbox(panel_target_item, ["bold", "italic", "underline"]);

    panel_target_item.append(create_close_button(current_text, "text"));
    left_panel.append(panel_target_item);
    check_style_boxes(current_text);
}

function change_colors(current_block, id_inner_div, description, property) {
    let color_panel = create_color_panel(
        "block_color_panel", 
        id_inner_div, 
        description, 
        true
    );
    color_panel[1].value = rgbToHex(current_block.style[property]);
    color_panel[1].addEventListener("change", function(event) {
        current_block.style[property] = event.target.value;
        print_HTML_code();
    });
  
    return color_panel[0];
}

function change_sizes(current_block, input_id, property, unit) {
    let input = "";

    if (property === "border") {
        input = create_size_panel(input_id, `border: ${current_block.style.borderWidth}`);
    } else {
        input = create_size_panel(input_id, `${property}: ${current_block.style[property]}`);
    }   
    input.addEventListener("change", function(event) {
        if (property === "border") {
            let input_border_color = document.getElementById("input_border_color").value;
            current_block.style[property] = `${event.target.value}px solid ${input_border_color}`;
            input.placeholder = `${property}: ${current_block.style.borderWidth}`;
        } else {
            current_block.style[property] = `${event.target.value}${unit}`;
            input.placeholder = `${property}: ${current_block.style[property]}`;
        }
    });
    
    return input;
}

// function change_shadow(current_block) {
//     let shadow_right = document.getElementById("shadow_right");
//     let shadow_down = document.getElementById("shadow_down");
//     let blur = document.getElementById("blur");

//     let shadow_style = current_block.style.boxShadow.split(/\s+/);
//     shadow_right.style.placeholder = shadow_style[1];
//     shadow_down.style.placeholder = shadow_style[2];
//     blur.style.placeholder = shadow_style[3];
// }

function change_current_block(current_block) {
    let panel_target_item = start_new_left_panel(current_block);
    
    panel_target_item.append(change_colors(current_block, "input_background_color", "-background", "backgroundColor"));
    panel_target_item.append(change_colors(current_block, "input_border_color", "-border color", "borderColor"));
    panel_target_item.append(change_colors(current_block, "input_text_color", "-text color", "color"));  

    panel_target_item.append(change_sizes(current_block, "input_width", "width", "px"));
    panel_target_item.append(change_sizes(current_block, "input_height", "height", "px"));

    panel_target_item.append(change_sizes(current_block, "input_border_size", "border", "px"));
    panel_target_item.append(change_sizes(current_block, "input_border_radius", "borderRadius", "px"));

    //panel_target_item.append(create_shadow_setting_panel());
    // shadow

    panel_target_item.append(create_close_button(current_block, "block"));
    left_panel.append(panel_target_item);
    // change_shadow(current_block);
}

function choose_item(event, type) {
    let current_item = event.target;

    if (type === "block" && current_item.style.outline) {
        back_default_left_panel(current_item, "block");
    } else if (type === "text" && current_item.style.border) {
        back_default_left_panel(current_item, "text");
    } else {
        for (let i = 0; i < targets_text.length; ++i) {
            targets_text[i].style.border = "";
        }
        for (let i = 0; i < target_blocks.length; ++i) {
            target_blocks[i].style.outline = "";
        }
        targets_text = [];
        target_blocks = [];

        if (type == "text") {
            current_item.style.border = "1px solid red";
            targets_text.push(current_item);
            change_current_text(current_item);
        } else if (type == "block") {
            current_item.style.outline = "2px dashed green";
            target_blocks.push(current_item);
            change_current_block(current_item);
        }
        document.addEventListener("keydown", delete_targets);
    }
    print_HTML_code();
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

        el.addEventListener("click", function(event) {
            choose_item(event, "text");
        });
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

    let shadow = "";
    let input_shadow_color = document.getElementById("input_shadow_color").value;
    let shadow_right = document.getElementById("shadow_right").value;
    let shadow_down = document.getElementById("shadow_down").value;
    let blur = document.getElementById("blur").value;
    shadow += shadow_right ? `${shadow_right}px ` : "0 ";
    shadow += shadow_down ? `${shadow_down}px ` : "0 ";
    shadow += blur ? `${blur}px ` : "0px ";
    shadow += input_shadow_color;
    el.style.boxShadow = shadow;

    el.style.color = document.getElementById("input_textinblock_color").value;
    el.style.backgroundColor = document.getElementById("input_background_color").value;

    el.addEventListener("click", function(event) {
        choose_item(event, "block");
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

function create_color_panel(id_div, id_inner_div, description, get_input) {
    let div = document.createElement("div");
    div.id = id_div;
    let input = document.createElement("input");
    input.type = "color";
    input.id = id_inner_div;

    div.append(input);
    div.append(description);

    return get_input ? [div, input] : div;
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

function create_shadow_setting_panel() {
    let div = document.createElement("div");
    div.id = "shadow_panel_setting";
    div.append("shadow");
    div.append(create_size_panel("shadow_right", "right px (0px)"));
    div.append(create_size_panel("shadow_down", "down px (0px)"));
    div.append(create_size_panel("blur", "blur px (0px)"));
    div.append(create_color_panel("block_color_panel", "input_shadow_color", "-shadow color"));
    return div;
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
    inner_div.append(create_shadow_setting_panel());
    
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
    left_panel.append(create_drop_down_list("block elements", ["div", "header", "footer", "aside", "table", "button"], "block"));
}

create_left_menu();