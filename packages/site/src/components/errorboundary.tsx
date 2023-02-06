import React, { Component } from 'react'

export class Errorboundary extends Component<{children: any}, {hasError: boolean}, {}> {

    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
      }
    static getDerivedStateFromError(error: any) {
        return { hasError: true };
      }

    componentDidCatch(error: any, errorInfo: any) {
        console.log("errorcheck", error);
        console.log("errorinfo", errorInfo);
      }

  render() {
    
        if (this.state.hasError) {

            return <h1>Something went wrong.</h1>;
          }
      
          return this.props.children; 
    
  }
}

export default Errorboundary