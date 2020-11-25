import React, { Component } from "react";
import { Drawer, AutoComplete, Input, Button } from 'antd';
import { isMobileOnly } from "react-device-detect";
import "antd/lib/select/style/index.css";
import "antd/lib/input/style/index.css";
import "antd/lib/button/style/index.css";
import "antd/lib/drawer/style/index.css";
  
const dataSource = ['Honda', 'Honda Civic', 'Honda Civic 2018', 'Honda Civic 2018 $100-$200'];

class ElasticSearch extends Component{
    state = { visible: false, placement: 'top' };
    ElasticSearch = () => {
        this.setState({
        visible: true,
        });
    };
    onClose = () => {
        this.setState({
        visible: false,
        });
    };

    render(){
        return(
            <div>
                <button className="ElasticSB-Btn" onClick={this.ElasticSearch}>
                    <img className="ElasticSB-Btn-img" src="./images/search.png" />
                </button>
                <Drawer
                placement={this.state.placement}
                closable={false}
                visible={this.state.visible}
                className="ElasticSB-drawer"
                >
                    {/* Drawer Content - Start */}
                    <div className="ElasticSB-close"> 
                        <button onClick={this.onClose}>
                            <img src="./images/close-common.png" />
                        </button>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="ElasticSB-content">
                                    <div>
                                        <div className="ElasticSB-search">
                                            <AutoComplete
                                            dataSource={dataSource}
                                            // allowClear={true}
                                            placeholder={isMobileOnly ? "Search by make, model, year, price…" : "Type to search by make, model, year, price…"}
                                            filterOption={(inputValue, option) =>
                                                option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                            className="ElasticSB-dropdown"
                                            >
                                                <Input
                                                suffix={
                                                    <Button className="ElasticSB-sub-btn" type="primary">
                                                        <img className="ElasticSB-Btn-img" src="./images/search.png" />
                                                    </Button>
                                                } />
                                            </AutoComplete>
                                            <img className="ElasticSB-search-magnifyglass" src="./images/search-black.png" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Drawer Content - End */}
                </Drawer>
            </div>
        )
    }
}

export default ElasticSearch;