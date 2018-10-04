import React from 'react';
import Editor from 'react-simple-code-editor';
import {highlight, languages} from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';
import SplitPane from 'react-split-pane';
import ObjectInspector from 'react-object-inspector';
import emuto from 'emuto';

const Label = ({children}) => (
  <div
    style={{
      position: 'absolute',
      top: '1em',
      right: '1em',
      background: 'antiquewhite',
      borderRadius: '10%',
      padding: '.1em .3em',
      fontSize: '.8em',
    }}>
    {children}
  </div>
);

class CustomEditor extends React.Component {
  render() {
    return (
      <Editor
        value={this.props.code}
        onValueChange={this.props.onValueChange}
        highlight={code => highlight(code, this.props.language)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          width: '100%',
          height: '100%',
        }}
      />
    );
  }
}

class App extends React.Component {
  state = {
    QueryCode: `.message`,
    JSONCode: `{
  "message": "Hello World!"
}
`,
  };

  onSetJSONCode(JSONCode) {
    this.setState({JSONCode});
  }

  onSetQueryCode(QueryCode) {
    this.setState({QueryCode});
  }

  render() {
    return (
      <SplitPane defaultSize="50%" split="vertical">
        <SplitPane defaultSize="50%" split="horizontal">
          <div
            style={{
              width: '100%',
              height: '100%',
            }}>
            <Label>Query</Label>
            <CustomEditor
              code={this.state.QueryCode}
              language={languages.clike}
              onValueChange={this.onSetQueryCode.bind(this)}
            />
          </div>
          <div
            style={{
              width: '100%',
              height: '100%',
            }}>
            <Label>Input</Label>
            <CustomEditor
              code={this.state.JSONCode}
              language={languages.json}
              onValueChange={this.onSetJSONCode.bind(this)}
            />
          </div>
        </SplitPane>
        <div
          style={{
            width: '100%',
            height: '100%',
            margin: '1em',
          }}>
          <Label>Output</Label>
          {(() => {
            try {
              return (
                <ObjectInspector
                  data={emuto.default(this.state.QueryCode)(
                    JSON.parse(this.state.JSONCode),
                  )}
                />
              );
            } catch (e) {
              return <div className="errorMessage">{e.toString()}</div>;
            }
          })()}
        </div>
      </SplitPane>
    );
  }
}

export default App;
