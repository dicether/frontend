import * as React from 'react'
import {connect} from 'react-redux';

import {Row, Col} from '../../reusable/index'
import StatsTable from './StatsTable'
import {getStats} from './actions'
import {DispatchProp} from '../../util/util';
import {State} from '../../rootReducer';

const Style = require('./HallOfFame.scss');


const mapStateToProps = ({hallOfFame}: State) => {
    const {mostWon, mostProfit, mostWagered} = hallOfFame;

    return {
        mostWon,
        mostWagered,
        mostProfit
    };
};

type ReduxProps = ReturnType<typeof mapStateToProps>;

type Props = DispatchProp & ReduxProps;

class HallOfFame extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(getStats());
    }

    render() {
        const {mostWagered, mostProfit} = this.props;

        return (
            <div>
                <h2 className={Style.heading}>Hall of Fame</h2>
                <Row>
                    <Col md={6}>
                        <StatsTable title="Most Wagered" name="Wagered" data={mostWagered}/>
                    </Col>
                    <Col md={6}>
                        <StatsTable title="Most Profit" name="Profit" data={mostProfit}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default connect(mapStateToProps)(HallOfFame);
