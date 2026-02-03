import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import { pasteToTextarea } from "./utils.js";

// Function to show the proposal in a beautiful interface
export function showProposalInterface(proposal, template) {
  // Remove existing modal
  const existingModal = document.getElementById("template-modal");
  if (existingModal) {
    existingModal.remove();
  }

  // Create container for React component
  const modalContainer = document.createElement("div");
  modalContainer.id = "proposal-interface";
  modalContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', sans-serif;
    animation: fadeIn 0.2s ease-out;
  `;

  // Add CSS animations
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .modal-content {
      animation: slideUp 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);

  // Add to page
  document.body.appendChild(modalContainer);

  // Render React component
  const root = ReactDOM.createRoot(modalContainer);
  root.render(
    <ProposalInterface
      proposal={proposal}
      template={template}
      onClose={() => modalContainer.remove()}
    />
  );
}

// Main Proposal Interface Component
function ProposalInterface({ proposal, template, onClose }) {
  const [wordCount, setWordCount] = useState({ words: 0, chars: 0 });
  const [lastSaved, setLastSaved] = useState("Auto-saved");
  const editorRef = useRef(null);

  // Convert line breaks to proper HTML formatting
  const formattedProposal = proposal
    .replace(/\n\n/g, "</p><p>") // Double line breaks become paragraph breaks
    .replace(/\n/g, "<br>") // Single line breaks become <br> tags
    .replace(/^/, "<p>") // Start with opening paragraph tag
    .replace(/$/, "</p>"); // End with closing paragraph tag

  const updateWordCount = () => {
    if (editorRef.current) {
      const text =
        editorRef.current.innerText || editorRef.current.textContent || "";
      const words = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0).length;
      const chars = text.length;
      setWordCount({ words, chars });
    }
  };

  useEffect(() => {
    updateWordCount();
  }, []);

  const handleToolbarAction = (action, button) => {
    console.log("Toolbar action triggered:", action);

    if (!editorRef.current) {
      console.log("Editor ref not found");
      return;
    }

    const textEditor = new TextEditor(editorRef.current);
    console.log("TextEditor instance created");

    // Update button active state
    const updateButtonState = (isActive) => {
      if (button) {
        if (isActive) {
          button.classList.add("active");
          button.style.background = "#dbeafe";
          button.style.borderColor = "#3b82f6";
          button.style.color = "#1d4ed8";
        } else {
          button.classList.remove("active");
          button.style.background = "transparent";
          button.style.borderColor = "transparent";
          button.style.color = "#374151";
        }
      }
    };

    switch (action) {
      case "bold":
        console.log("Bold action triggered");
        textEditor.toggleFormat("strong");
        break;
      case "italic":
        console.log("Italic action triggered");
        textEditor.toggleFormat("em");
        break;
      case "underline":
        console.log("Underline action triggered");
        textEditor.toggleFormat("u");
        break;
      case "bulletList":
        textEditor.insertList(false);
        break;
      case "numberedList":
        textEditor.insertList(true);
        break;
      case "quote":
        textEditor.insertBlockquote();
        break;
      case "alignLeft":
        textEditor.setAlignment("left");
        updateButtonState(true);
        // Reset other alignment buttons
        document.querySelectorAll('[data-action^="align"]').forEach((btn) => {
          if (btn !== button) {
            btn.classList.remove("active");
            btn.style.background = "transparent";
            btn.style.borderColor = "transparent";
            btn.style.color = "#374151";
          }
        });
        break;
      case "alignCenter":
        textEditor.setAlignment("center");
        updateButtonState(true);
        document.querySelectorAll('[data-action^="align"]').forEach((btn) => {
          if (btn !== button) {
            btn.classList.remove("active");
            btn.style.borderColor = "transparent";
            btn.style.color = "#374151";
          }
        });
        break;
      case "alignRight":
        textEditor.setAlignment("right");
        updateButtonState(true);
        document.querySelectorAll('[data-action^="align"]').forEach((btn) => {
          if (btn !== button) {
            btn.style.color = "#374151";
          }
        });
        break;
    }

    // Focus back to editor
    editorRef.current.focus();
  };

  const handleCopyPaste = () => {
    if (editorRef.current) {
      // Get only the text content, not HTML with styles
      const editedProposal =
        editorRef.current.innerText || editorRef.current.textContent || "";
      if (pasteToTextarea(editedProposal)) {
        // Show success feedback
        setLastSaved("Applied!");
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    }
  };

  const handleBackClick = (e) => {
    e.preventDefault();
    // Close the proposal interface first
    onClose();
    // Then show the template modal
    setTimeout(() => {
      if (window.showTemplateModal) {
        window.showTemplateModal();
      }
    }, 100);
  };

  const toolbarGroups = [
    {
      name: "formatting",
      buttons: [
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h7a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>`,
          title: "Bold",
          action: "bold",
          shortcut: "Ctrl+B",
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>`,
          title: "Italic",
          action: "italic",
          shortcut: "Ctrl+I",
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4h12"/><path d="M6 20h12"/><path d="M6 12h12"/></svg>`,
          title: "Underline",
          action: "underline",
          shortcut: "Ctrl+U",
        },
      ],
    },
    {
      name: "structure",
      buttons: [
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M3 6h.01"/><path d="M3 12h.01"/><path d="M3 18h.01"/></svg>`,
          title: "Bullet List",
          action: "bulletList",
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 6h11"/><path d="M10 12h11"/><path d="M10 18h11"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>`,
          title: "Numbered List",
          action: "numberedList",
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 10h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6"/><path d="M6 10V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2"/><path d="M18 10h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2"/></svg>`,
          title: "Quote",
          action: "quote",
        },
      ],
    },
    {
      name: "alignment",
      buttons: [
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>`,
          title: "Align Left",
          action: "alignLeft",
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>`,
          title: "Align Center",
          action: "alignCenter",
        },
        {
          icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>`,
          title: "Align Right",
          action: "alignRight",
        },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[100000] font-sans animate-fade-in">
      <div className="bg-white rounded-2xl max-w-6xl w-[98%] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-start px-5 pt-5 mb-5">
          <div>
            <h2 className="m-0 mb-2 text-[#1a1a1a] text-[28px] font-bold tracking-[-0.5px]">
              AI Proposal Editor
            </h2>
            <p className="m-0 text-gray-500 text-sm font-normal">
              Edit and refine your AI-generated proposal
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={handleBackClick}
              className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 text-sm font-medium cursor-pointer flex items-center gap-1.5 transition-all duration-200 ease-out mb-2 hover:bg-gray-200 hover:border-gray-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to Templates
            </button>

            <button
              onClick={onClose}
              className="bg-gray-100 border border-gray-200 rounded-lg p-2 cursor-pointer text-gray-500 flex items-center justify-center transition-all duration-200 ease-out hover:bg-red-100 hover:border-red-200 hover:text-red-600"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m18 6-12 12" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col px-5 overflow-hidden">
          <div className="flex-1 flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {/* Toolbar */}
            <div className="bg-gradient-to-b from-gray-50 to-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-1 flex-wrap min-h-14">
              {toolbarGroups.map((group, groupIndex) => (
                <React.Fragment key={group.name}>
                  <div className="flex items-center gap-0.5 px-1">
                    {group.buttons.map((btn) => (
                      <button
                        key={btn.action}
                        onClick={(e) => {
                          e.preventDefault();
                          handleToolbarAction(btn.action, e.target);
                        }}
                        title={`${btn.title}${
                          btn.shortcut ? ` (${btn.shortcut})` : ""
                        }`}
                        data-action={btn.action}
                        className="bg-transparent border border-transparent rounded-md p-2 cursor-pointer text-gray-700 flex items-center justify-center transition-all duration-150 ease-out w-8 h-8 hover:bg-gray-200 hover:border-gray-300"
                        dangerouslySetInnerHTML={{ __html: btn.icon }}
                      />
                    ))}
                  </div>
                  {groupIndex < toolbarGroups.length - 1 && (
                    <div className="w-px h-5 bg-gray-300 mx-2" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Editor content */}
            <div
              ref={editorRef}
              contentEditable="true"
              className="flex-1 p-6 leading-7 text-gray-800 text-[15px] font-sans outline-none bg-white overflow-y-auto min-h-[400px] max-h-[500px]"
              dangerouslySetInnerHTML={{ __html: formattedProposal }}
              onInput={updateWordCount}
            />

            {/* Status bar */}
            <div className="bg-gray-50 border-t border-gray-200 px-4 py-2 flex justify-between items-center text-xs text-gray-500">
              <span>
                {wordCount.words} words, {wordCount.chars} characters
              </span>
              <span className="text-emerald-600">{lastSaved}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-8 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end items-center">
          <button
            onClick={handleCopyPaste}
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2 transition-all duration-300 ease-out shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 relative overflow-hidden"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </svg>
            Copy & Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// Modern text editing utilities
class TextEditor {
  constructor(element) {
    this.element = element;
  }

  getSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    return selection.getRangeAt(0);
  }

  wrapSelection(tagName, className = "") {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
      const wrapper = document.createElement(tagName);
      if (className) wrapper.className = className;

      try {
        range.surroundContents(wrapper);
      } catch (e) {
        // If surroundContents fails, use alternative method
        wrapper.textContent = selectedText;
        range.deleteContents();
        range.insertNode(wrapper);
      }

      // Clear selection and place cursor after the wrapper
      selection.removeAllRanges();
      const newRange = document.createRange();
      newRange.setStartAfter(wrapper);
      newRange.collapse(true);
      selection.addRange(newRange);
    }
  }

  insertText(text) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(document.createTextNode(text));
    range.collapse(false);
  }

  toggleFormat(tagName) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (!selectedText) return; // No text selected

    // Use execCommand for basic formatting (more reliable)
    switch (tagName.toLowerCase()) {
      case "strong":
      case "b":
        document.execCommand("bold", false, null);
        break;
      case "em":
      case "i":
        document.execCommand("italic", false, null);
        break;
      case "u":
        document.execCommand("underline", false, null);
        break;
      default:
        // Fallback to manual wrapping for other tags
        this.wrapSelection(tagName);
    }
  }

  setAlignment(align) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      this.element.style.textAlign = align;
      return;
    }

    const range = selection.getRangeAt(0);
    let element = range.commonAncestorContainer;

    if (element.nodeType === Node.TEXT_NODE) {
      element = element.parentElement;
    }

    // Find the block element to align
    while (
      element &&
      element !== this.element &&
      !["P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6"].includes(
        element.tagName
      )
    ) {
      element = element.parentElement;
    }

    if (element && element !== this.element) {
      element.style.textAlign = align;
    } else {
      this.element.style.textAlign = align;
    }
  }

  insertList(ordered = false) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const listElement = document.createElement(ordered ? "ol" : "ul");
    const listItem = document.createElement("li");

    const selectedText = range.toString();
    if (selectedText) {
      listItem.textContent = selectedText;
      range.deleteContents();
    } else {
      listItem.textContent = "List item";
    }

    listElement.appendChild(listItem);
    range.insertNode(listElement);

    // Place cursor in the list item
    const newRange = document.createRange();
    newRange.selectNodeContents(listItem);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  insertBlockquote() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const blockquote = document.createElement("blockquote");

    const selectedText = range.toString();
    if (selectedText) {
      blockquote.textContent = selectedText;
      range.deleteContents();
    } else {
      blockquote.textContent = "Quote text here...";
    }

    range.insertNode(blockquote);

    // Place cursor in the blockquote
    const newRange = document.createRange();
    newRange.selectNodeContents(blockquote);
    newRange.collapse(false);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }

  insertLink() {
    const url = prompt("Enter URL:");
    if (!url) return;

    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";

    const selectedText = range.toString();
    if (selectedText) {
      link.textContent = selectedText;
      range.deleteContents();
    } else {
      link.textContent = url;
    }

    range.insertNode(link);

    // Place cursor after the link
    const newRange = document.createRange();
    newRange.setStartAfter(link);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
}
