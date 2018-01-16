import React from 'react';
import ReactDOM from 'react-dom';
import { defaultCreateCache, defaultMapConfig, mapStyles } from './GoogleMapHelpers';

export const wrapper = (options) => (WrappedComponent) => {
    const apiKey = options.apiKey;
    const libraries = options.libraries || ['places'];
    const version = options.version || '3.24';
    const createCache = options.createCache || defaultCreateCache;

    class Wrapper extends React.Component {
        constructor(props, context) {
            super(props, context);

            this.state = {
                loaded: false,
                google: null
            };

            this.scriptCache = createCache(options);
            this.scriptCache.google.onLoad(this.onLoad.bind(this));
        }

        onLoad(err, tag) {
            this.setState({
                loaded: true,
                google: window.google
            });
        }

        render() {
            const props = Object.assign({}, this.props, {
                google: this.state.google,
                loaded: this.state.loaded
            });

            return (
                <div>
                    <WrappedComponent {...props}/>
                </div>
            )
        }
    }

    return Wrapper;
}

export default wrapper;

