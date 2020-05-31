<script>
  import { CodeJar } from 'codejar';
  import { withLineNumbers } from 'codejar/linenumbers';
  import { onMount } from 'svelte';
  import hljs from 'highlight.js';

  let codeEditor;
  const editorOptions = {
    tab: ' '.repeat(2) // two space indentation
  };
  const highlight = editor => {
    // highlight.js does not trims old tags,
    // let's do it by this hack.
    editor.textContent = editor.textContent
    hljs.highlightBlock(editor)
  }

  onMount(() => {
    const jar = CodeJar(codeEditor, withLineNumbers(highlight), editorOptions);
  });
  const editorWidth = window.innerWidth - window.innerHeight - 30;
  const editorHeight = window.innerHeight - 10;
  const style = `width: ${editorWidth}px; height: ${editorHeight}px`;
</script>

<style>
  .editor {
    border-radius: 3px;
    font-family: 'Source Code Pro', monospace;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: normal;
    line-height: 20px;
  }
  pre {
    margin: 0px;
    margin-left: 5px;
  }
</style>
<pre>
  <code {style} class='language-js editor' bind:this={codeEditor}/>
</pre>