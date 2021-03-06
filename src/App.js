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
import debounceRender from 'react-debounce-render';
import beautify from 'json-beautify';
import JSONCode from './input.json';

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
      zIndex: '10',
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
        }}
      />
    );
  }
}

const Scroll = ({children}) => (
  <div
    style={{
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      overflow: 'auto',
    }}>
    {children}
  </div>
);

const EmutoOutput = ({QueryCode, JSONCode}) => {
  try {
    const result = emuto(QueryCode)(JSON.parse(JSONCode));
    console.log(result);
    try {
      return (
        <Scroll>
          <CustomEditor
            code={beautify(result, null, 2)}
            language={languages.json}
            onValueChange={() => {}}
          />
        </Scroll>
      );
    } catch (e) {
      return <ObjectInspector data={result} />;
    }
  } catch (e) {
    return <div className="errorMessage">{e.toString()}</div>;
  }
};

const DebouncedEmutoOutput = debounceRender(EmutoOutput);

class App extends React.Component {
  state = {
    QueryCode: `$ { producer, title, ...Stats }

where
  $Stats = ($ => {
      "characters": ($.characters | length),
      "starships": ($.starships | length),
      "planets": ($.planets | length)
    })`,
    JSONCode: beautify(JSONCode, null, 2),
  };

  onSetJSONCode(JSONCode) {
    this.setState({JSONCode});
  }

  onSetQueryCode(QueryCode) {
    this.setState({QueryCode});
  }

  render() {
    return (
      <SplitPane defaultSize="55%" minSize={300} split="vertical">
        <SplitPane defaultSize="20%" minSize={150} split="horizontal">
          <div
            style={{
              width: '100%',
              height: '100%',
            }}>
            <Scroll>
              <Label>Query</Label>
              <CustomEditor
                code={this.state.QueryCode}
                language={languages.clike}
                onValueChange={this.onSetQueryCode.bind(this)}
              />
            </Scroll>
          </div>
          <div
            style={{
              width: '100%',
              height: '100%',
            }}>
            <Scroll>
              <Label>Input</Label>
              <CustomEditor
                code={this.state.JSONCode}
                language={languages.json}
                onValueChange={this.onSetJSONCode.bind(this)}
              />
            </Scroll>
          </div>
        </SplitPane>
        <div
          style={{
            width: '100%',
            height: '100%',
            margin: '1em',
          }}>
          <Label>Output</Label>
          <DebouncedEmutoOutput
            JSONCode={this.state.JSONCode}
            QueryCode={this.state.QueryCode}
          />
        </div>
      </SplitPane>
    );
  }
}

export default App;
