import React, { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import PropTypes from "prop-types";
import Quill from "quill";
import { Delta } from "quill/core";

import "quill/dist/quill.snow.css";

const QuillEditor = forwardRef(({ readOnly = false, value, onChange }, ref) => {
    const containerRef = useRef(null);
    const valueRef = useRef(value);
    const onChangeRef = useRef(onChange);

    useLayoutEffect(() => {
        onChangeRef.current = onChange;
    });

    useEffect(() => {
        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div")
        );
        const quill = new Quill(editorContainer, {
            theme: "snow",
            readOnly,
        });

        if (ref) ref.current = quill;

        if (valueRef.current) {
            const isHTML = /^<([a-z]+)[^>]*>[\S\s]*<\/\1>$/.test(valueRef.current);
            const contentValue = isHTML
                ? quill.clipboard.convert({ html: valueRef.current })
                : new Delta().insert(valueRef.current);
            quill.setContents(contentValue);
        }

        quill.on(Quill.events.TEXT_CHANGE, () => {
            onChangeRef.current?.(quill.getSemanticHTML());
        });

        return () => {
            if (ref) ref.current = null;
            container.innerHTML = "";
        };
    }, [ref, readOnly]);

    return <div ref={containerRef}></div>;
});

QuillEditor.displayName = "Quill Editor";

QuillEditor.propTypes = {
    readOnly: PropTypes.bool,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

export default QuillEditor;