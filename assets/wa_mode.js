// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE
// Reference: https://cdn.jsdelivr.net/npm/codemirror@5.65.8/mode/go/go.js

(function (mod) {
  mod(CodeMirror);
})(function (CodeMirror) {
  "use strict";

  CodeMirror.defineMode("wa", (config) => {
    const indentUnit = config.indentUnit;
    const keywords = {
      "break": true, "defer": true, "import": true, "struct": true, "case": true,
      "else": true, "interface": true, "switch": true, "const": true, "for": true,
      "map": true, "type": true, "continue": true, "func": true, "range": true,
      "var": true, "default": true, "if": true, "return": true,
    };

    const isOperatorChar = /(\+|&|\+=|&=|&&|==|!=|-|\||-=|\|=|\|\||<|<=|\*|\^|\*=|\^=|<-|>|>=|\/|<<|\/=|<<=|\+\+|=|:=|%|>>|%=|>>=|\-\-|!|&\^|&\^=)/;

    let curPunc;

    const tokenBase = (stream, state) => {
      const ch = stream.next();
      if (ch == '"' || ch == "'" || ch == "`") {
        state.tokenize = tokenString(ch);
        return state.tokenize(stream, state);
      }
      if (/[\d\.]/.test(ch)) {
        if (ch == ".") {
          stream.match(/^[0-9]+([eE][\-+]?[0-9]+)?/);
        } else if (ch == "0") {
          stream.match(/^[xX][0-9a-fA-F]+/) || stream.match(/^0[0-7]+/);
        } else {
          stream.match(/^[0-9]*\.?[0-9]*([eE][\-+]?[0-9]+)?/);
        }
        return "number";
      }
      if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
        curPunc = ch;
        return null;
      }
      if (ch == "/") {
        if (stream.eat("*")) {
          state.tokenize = tokenComment;
          return tokenComment(stream, state);
        }
        if (stream.eat("/")) {
          stream.skipToEnd();
          return "comment";
        }
      }
      if (isOperatorChar.test(ch)) {
        stream.eatWhile(isOperatorChar);
        return "operator";
      }
      stream.eatWhile(/[\w\$_\xa1-\uffff]/);
      const cur = stream.current();
      if (keywords.propertyIsEnumerable(cur)) {
        if (cur == "case" || cur == "default") curPunc = "case";
        return "keyword";
      }
      return "variable";
    }

    const tokenString = (quote) => {
      return function (stream, state) {
        let escaped = false, next, end = false;
        while ((next = stream.next()) != null) {
          if (next == quote && !escaped) { end = true; break; }
          escaped = !escaped && quote != "`" && next == "\\";
        }
        if (end || !(escaped || quote == "`"))
          state.tokenize = tokenBase;
        return "string";
      };
    }

    function tokenComment(stream, state) {
      var maybeEnd = false, ch;
      while (ch = stream.next()) {
        if (ch == "/" && maybeEnd) {
          state.tokenize = tokenBase;
          break;
        }
        maybeEnd = (ch == "*");
      }
      return "comment";
    }

    function Context(indented, column, type, align, prev) {
      this.indented = indented;
      this.column = column;
      this.type = type;
      this.align = align;
      this.prev = prev;
    }

    const pushContext = (state, col, type) => {
      return state.context = new Context(state.indented, col, type, null, state.context);
    }

    const popContext = (state) => {
      if (!state.context.prev) return;
      const t = state.context.type;
      if (t == ")" || t == "]" || t == "}")
        state.indented = state.context.indented;
      return state.context = state.context.prev;
    }

    return {
      startState: (basecolumn) => {
        return {
          tokenize: null,
          context: new Context((basecolumn || 0) - indentUnit, 0, "top", false),
          indented: 0,
          startOfLine: true
        };
      },

      token: (stream, state) => {
        const ctx = state.context;
        if (stream.sol()) {
          if (ctx.align == null) ctx.align = false;
          state.indented = stream.indentation();
          state.startOfLine = true;
          if (ctx.type == "case") ctx.type = "}";
        }
        if (stream.eatSpace()) return null;
        curPunc = null;
        const style = (state.tokenize || tokenBase)(stream, state);
        if (style == "comment") return style;
        if (ctx.align == null) ctx.align = true;

        if (curPunc == "{") pushContext(state, stream.column(), "}");
        else if (curPunc == "[") pushContext(state, stream.column(), "]");
        else if (curPunc == "(") pushContext(state, stream.column(), ")");
        else if (curPunc == "case") ctx.type = "case";
        else if (curPunc == "}" && ctx.type == "}") popContext(state);
        else if (curPunc == ctx.type) popContext(state);
        state.startOfLine = false;
        return style;
      },

      indent: (state, textAfter) => {
        if (state.tokenize != tokenBase && state.tokenize != null) return CodeMirror.Pass;
        const ctx = state.context, firstChar = textAfter && textAfter.charAt(0);
        if (ctx.type == "case" && /^(?:case|default)\b/.test(textAfter)) {
          state.context.type = "}";
          return ctx.indented;
        }
        const closing = firstChar == ctx.type;
        if (ctx.align) return ctx.column + (closing ? 0 : 1);
        else return ctx.indented + (closing ? 0 : indentUnit);
      },
      electricChars: "{}):",
      closeBrackets: "()[]{}''\"\"``",
      fold: "brace",
      blockCommentStart: "/*",
      blockCommentEnd: "*/",
      lineComment: "//"
    };
  });

  CodeMirror.defineMIME("text/x-wa", "wa");
});