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

// create text or block element
// function add_element(event, idf, input, select_value) {
//     if (idf === "text" && !input.value) {
//         input.style.borderColor = "red";
//     } else {
//         let el = document.createElement(select_value);
    
//         if (input.value) {
//             el.textContent = input.value;
//         }

//         if (idf === "form") {
//             el.style.border = "1px solid black";
//             el.style.height = "40px";
//             el.style.width = "70px";

//             el.addEventListener("click", function() {
//                 print_HTML_code();
//             });
//         }
        
//         if (idf === "text") {
//             let color = document.getElementById("input_color");
//             el.style.color = color.value;
//         }

//         right_panel.append(el);
//         print_HTML_code();
//     }
// }

function default_form_setting(idf, div) {
    div.id = "setting_panel " + idf;

    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "type text";
    div.append(input);
}

// function deafult_button_setting(event, idf, input, select_value, main_text) {
//     let btn = document.createElement("button");
//     btn.textContent = "create";
//     btn.addEventListener("click", function() {
//         add_element(event, idf, input, select_value);
//     });

//     div.append(btn);

//     let btn_close = document.createElement("button");
//     btn_close.textContent = "close";
//     btn_close.addEventListener("click", function() {
//         remove_panel(idf, main_text);
//     });

//     div.append(btn_close);
// }

function create_text_color_setting_panel() {
    let inner_div = document.createElement("div");

    let span = document.createElement("span");
    span.textContent = "color: ";
    inner_div.append(span);

    let input_color = document.createElement("input");
    input_color.type = "color";
    input_color.id = "input_color";

    inner_div.append(input_color);

    return inner_div;
}

function create_setting_panel(event, idf, main_text) {
    const select_value = event.target.value;
    let setting_panel = document.getElementById(idf);

    if (!document.getElementById(("setting_panel " + idf))) {

        let div = document.createElement("div");
        default_form_setting(idf, div);

        if (idf === "text") {
            div.append(create_text_color_setting_panel());
        }

        //deafult_button_setting(event, idf, input, select_value, main_text);

        setting_panel.append(div);
    }
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
