wasm_bindgen("pkg/webgl_bg.wasm").catch(console.error)
.then(show_logo);
//display("Drop a PDF here");


function show_logo() {
    fetch("Ghostscript_Tiger.svg")
    .then(r => r.arrayBuffer())
    .then(buf => init_view(new Uint8Array(buf)));
}

function set_scroll_factors() {}

function drop_handler(e) {
    e.stopPropagation();
    e.preventDefault();
    show(e.dataTransfer.files[0]);
}
function dragover_handler(e) {
    e.stopPropagation();
    e.preventDefault();
}

let view;
function init_view(data) {
    let canvas = document.getElementById("canvas");
    view = wasm_bindgen.view(canvas, data);

    let requested = false;
    function animation_frame(time) {
        requested = false;
        view.animation_frame(time);
    }
    function check(request_redraw) {
        if (request_redraw && !requested) {
            window.requestAnimationFrame(animation_frame);
            requested = true;
        }
    }

    window.addEventListener("keydown", e => check(view.key_down(e)), {capture: true});
    window.addEventListener("keyup", e => check(view.key_up(e)), {capture: true});
    canvas.addEventListener("mousemove", e => check(view.mouse_move(e)));
    canvas.addEventListener("mouseup", e => check(view.mouse_up(e)));
    canvas.addEventListener("mousedown", e => check(view.mouse_down(e)));
    window.addEventListener("resize", e => check(view.resize(e)));
    view.render();
}


function show(file) {
    let reader = new FileReader();
    reader.onload = function() {
        let data = new Uint8Array(reader.result);
        init_view(data);

    };
    reader.readAsArrayBuffer(file);
}

document.addEventListener("drop", drop_handler, false);
document.addEventListener("dragover", dragover_handler, false);

