"use client";

import React from 'react';
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnStrikeThrough, BtnBulletList, BtnNumberedList, BtnLink, BtnClearFormatting, HtmlButton, Separator } from 'react-simple-wysiwyg';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    function onContentChange(e: any) {
        onChange(e.target.value);
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <EditorProvider>
                <Editor
                    value={value}
                    onChange={onContentChange}
                    placeholder={placeholder}
                    containerProps={{ style: { minHeight: '400px', fontSize: '16px', lineHeight: '1.6', color: '#374151' } }}
                >
                    <Toolbar>
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <BtnStrikeThrough />
                        <Separator />
                        <BtnBulletList />
                        <BtnNumberedList />
                        <Separator />
                        <BtnLink />
                        <BtnClearFormatting />
                        <HtmlButton />
                    </Toolbar>
                </Editor>
            </EditorProvider>
        </div>
    );
}
