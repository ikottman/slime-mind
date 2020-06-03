<script>
  import { CodeJar } from 'codejar';
  import { withLineNumbers } from 'codejar/linenumbers';
  import { onMount } from 'svelte';
  import hljs from 'highlight.js';
  import { codeStore } from './store';

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
    // create editor and save off any updates
    const jar = CodeJar(codeEditor, withLineNumbers(highlight), editorOptions);
    jar.onUpdate(code => {
      codeStore.update(c => code);
    });

    // see if they have previously saved code and load it
    const storedCode = window.localStorage.getItem('ai_code');
    if (storedCode) {
      jar.updateCode(storedCode);
    }
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