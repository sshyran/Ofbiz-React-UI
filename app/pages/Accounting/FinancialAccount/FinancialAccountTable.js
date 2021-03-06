import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Button, Icon, Popconfirm, Input, Badge } from 'antd';
import TableOptions from '../../../common/Table/TableOptions';
import FinancialAccountSearchForm from './FinancialAccountSearchForm';
import * as actionConsts from '../../../common/TitlePane/ActionConsts';
import * as localConsts from './FinancialAccountConsts';
import styles from '../../../common/Styles.less';
const ButtonGroup = Button.Group;
class FinancialAccountTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedObjects: [],
      loading: false,
      lazyDataLoading: false,
      filtersAppliedValue: {},
      borderedValue: true,
      showHeaderValue: true,
      scrollValue: { x: 1000 },
      expandableValue: this.expandedRowRenderPanel,
      rowSelectionValue: true,
      paginationValue: { position: 'bottom' },
      Data: [],
    };
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.data != undefined) {
      var tmp = [];
      tmp.push({ finAccountId: nextProps.data.finAccountId });
      this.setState({ Data: tmp });
    }
    this.setState({ loading: false });
  }
  componentDidMount() {
    this.props.setClick(value => {
      this.toggleTableRowsSelected(value);
    });
    this.props.clearSelected(() => {
      this.toggleTableRowsSelectedClear();
    });
  }
  render() {
    console.log(this.state.Data);
    const {
      selectedRowKeys,
      borderedValue,
      showHeaderValue,
      scrollValue,
      rowSelectionValue,
    } = this.state;
    let { data } = this.props;
    data = data.content || [];
    const rowSelection = rowSelectionValue
      ? {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
          this.onSelectChange(selectedKeys, selectedRows);
        },
      }
      : undefined;
    const paginationProps = {
      ...this.state.paginationValue,
      total: this.props.data.totalElements,
      showTotal: this.showTotal,
      showQuickJumper: true,
      defaultCurrent: 1,
      onShowSizeChange: this.onShowSizeChange,
      showSizeChanger: true,
    };
    return (
      <div>
        <div>
          <Table
            className={styles.tableContainer}
            rowKey="id"
            title={this.tableHeader}
            columns={this.tableColumns}
            loading={this.state.loading}
            dataSource={this.state.Data}
            size="small"
            bordered={borderedValue}
            showHeader={showHeaderValue}
            scroll={{ x: 1300 }}
            scroll={scrollValue}
            rowSelection={rowSelection}
            pagination={paginationProps}
            onChange={this.handleStandardTableChange}
          />
        </div>
      </div>
    );
  }
  tableColumns = [
    {
      title: `${localConsts.FinAccountId}`,
      dataIndex: 'finAccountId',
      key: 'finAccountId',
      // fixed: 'left',
      sorter: (a, b) => a.name.length - b.name.length,
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
          <div className={styles.customFilterDropdown}>
            <Input
              className={styles.tableColumnName}
              placeholder={localConsts.COLUMN_NAME_PLACEHOLDER}
              value={selectedKeys[0]}
              ref={ele => (this.searchInput = ele)}
              onChange={e =>
                setSelectedKeys(e.target.value ? [e.target.value] : [])
              }
              onPressEnter={this.handleColumnFilterSearch(selectedKeys, confirm)}
            />
            <ButtonGroup>
              <Button
                className={styles.tableColumnNameButton}
                type="primary"
                icon="search"
                size="default"
                onClick={this.handleColumnFilterSearch(selectedKeys, confirm)}
              />
              <Button
                type="danger"
                icon="rollback"
                size="default"
                onClick={this.handleColumnFilterReset(clearFilters)}
              />
            </ButtonGroup>
          </div>
        ),
      filterIcon: filtered => (
        <Icon type="filter" style={{ color: filtered ? 'red' : '#aaa' }} />
      ),
      onFilter: (value, record) => {
        const returnValue =
          (record.name ? record.name.toLowerCase() : '') +
          (record.code ? `${record.code}`.toLowerCase() : '');
        return returnValue.includes(value);
      },
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => {
            this.searchInput.focus();
          });
        }
      },
      render: (text, data) => {
        const { searchText } = this.state;
        const numbers = /^[0-9]+$/;
        let badgeType = styles.badgeDefault;
        if (data.blocked === true) {
          badgeType = styles.badgeError;
        } else if (data.status === true) {
          badgeType = styles.badgeSuccess;
        }
        return searchText ? (
          searchText.match(numbers) ? (
            <div>
              <Badge size="large" status="none" className={badgeType} />
              <Button
                className={styles.anchorNameStyle}
                onClick={() => {
                  this.props.handleSubmitAction(
                    actionConsts.ACTION_TYPE_SINGLE_SELECTION,
                    data,
                  );
                  this.props.toggleView();
                }}
              >
                {text
                  .split(
                    new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'),
                  )
                  .map(
                    (fragment, i) =>
                      fragment.toLowerCase() === searchText.toLowerCase() ? (
                        <span key={i} className={styles.highlight}>
                          {fragment}
                        </span>
                      ) : (
                          fragment
                        ),
                  )}
              </Button>
              <span className={styles.anchorCode}>
                {data.code
                  .split(
                    new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'),
                  )
                  .map(
                    (fragment, i) =>
                      fragment === searchText ? (
                        <span key={i} className={styles.highlight}>
                          {fragment}
                        </span>
                      ) : (
                          fragment
                        ),
                  )}
              </span>
            </div>
          ) : (
              <div>
                {/* <Badge size="large" status="none" className={badgeType} /> */}
                <Button
                  className={styles.anchorNameStyle}
                  onClick={() => {
                    this.props.handleSubmitAction(
                      actionConsts.ACTION_TYPE_SINGLE_SELECTION,
                      data,
                    );
                    this.props.toggleEdit();
                  }}
                >
                  {text
                    .split(
                      new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'),
                    )
                    .map(
                      (fragment, i) =>
                        fragment.toLowerCase() === searchText.toLowerCase() ? (
                          <span key={i} className={styles.highlight}>
                            {fragment}
                          </span>
                        ) : (
                            fragment
                          ),
                    )}
                </Button>
                {/* <span className={styles.anchorCode}>({data.code})</span> */}
              </div>
            )
        ) : (
            <div>
              {/* <Badge size="large" status="none" className={badgeType} /> */}
              <Button
                className={styles.anchorNameStyle}
                onClick={() => {
                  this.props.handleSubmitAction(
                    actionConsts.ACTION_TYPE_SINGLE_SELECTION,
                    data,
                  );
                  this.props.toggleView();
                }}
              >
                {text}
              </Button>
            </div>
          );
      },
    },
    {
      title: `${localConsts.FinAccountType}`,
      dataIndex: 'Invoice Type',
      sorter: (a, b) => a.shortName.length - b.shortName.length,
    },
    {
      title: `${localConsts.Status}`,
      dataIndex: 'Invoice Date',
    },
    {
      title: `${localConsts.FinAccountName}`,
      dataIndex: 'ToParty',
    },
    {
      title: `${localConsts.FinAccountCode}`,
      dataIndex: 'FromParty',
    },
    {
      title: `${localConsts.FinAccountPin}`,
      dataIndex: 'FromParty',
    },
    {
      title: `${localConsts.Currency}`,
      dataIndex: 'FromParty',
    },
    {
      title: `${localConsts.OrganizationPartyId}`,
      dataIndex: 'FromParty',
    },
    {
      title: `${localConsts.OwnerPartyId}`,
      dataIndex: 'FromParty',
    },
    {
      title: `${localConsts.PostToGlAccountId}`,
      dataIndex: 'FromParty',
    },
    {
      title: `${localConsts.FromDate}`,
      dataIndex: 'FromParty',
    },
    {
      title: `${localConsts.ThroughDate}`,
      dataIndex: 'FromParty',
    },
    {
      title: `${localConsts.IsRefundable}`,
      dataIndex: 'FromParty',
    },
    {
      title: `${localConsts.ReplenishPaymentId}`,
      dataIndex: 'FromParty',
    },
    {
      title: `${localConsts.ReplenishLevel}`,
      dataIndex: 'FromParty',
    },
    {
      title: `${localConsts.ActualBalance}`,
      dataIndex: 'FromParty',
    },

    {
      title: `${localConsts.AvailableBalance}`,
      dataIndex: 'FromParty',
    },
    {
      title: `${localConsts.COLUMN_ACTIONS}`,
      width: 150,
      render: data => (
        <div>
          &emsp;
          <Popconfirm
            title={localConsts.POPCONFIRM_TITLE}
            icon={<Icon type="question" style={{ color: 'red' }} />}
            okText={localConsts.POPCONFIRM_OK_TEXT}
            okType="danger"
            cancelText={localConsts.POPCONFIRM_CANCEL_TEXT}
            placement={localConsts.POPCONFIRM_PLACEMENT}
            onConfirm={() =>
              this.props.handleSubmitAction(
                actionConsts.ACTION_TYPE_REMOVE_FA,
                data,
              )
            }
          >
            <Icon type="delete" className={styles.icon} />
          </Popconfirm>&emsp;
        </div>
      ),
    },



  ];
  expandedRowRenderPanel = record => (
    <div>
      <div className={styles.description}>
        <span className={styles.remarks}>Description:</span> {record.remarks}
      </div>
      <div className={styles.description}>
        <span className={styles.address}>Address:</span> {record.addresses}
      </div>
    </div>
  );
  tableHeader = () => (
    <div>
      <TableOptions
        handleTableProperties={this.handleTableProperties}
        handleSubmitAction={this.props.handleSubmitAction}
        handleLazyDataLoading={this.handleLazyDataLoading}
        searchForm={FinancialAccountSearchForm}
      />
    </div>
  );
  handleTableProperties = (
    filtersAppliedParam,
    borderedParam,
    showHeaderParam,
    fixedHeaderParam,
    expandableParam,
    rowSelectionParam,
    paginationParam,
  ) => {
    const fixedHeader = fixedHeaderParam ? { x: 1000, y: 340 } : { x: 1000 };
    const expandable = expandableParam
      ? this.expandedRowRenderPanel
      : undefined;
    this.setState({
      filtersAppliedValue: filtersAppliedParam,
      borderedValue: borderedParam,
      showHeaderValue: showHeaderParam,
      scrollValue: fixedHeader,
      expandableValue: expandable,
      rowSelectionValue: rowSelectionParam,
      paginationValue: paginationParam,
    });
  };
  handleLazyDataLoading = checked => {
    this.setState({ lazyDataLoading: checked }, () => {
      const { lazyDataLoading, currentPageValue, pageSizeValue } = this.state;
      const params = {
        currentPage: currentPageValue,
        pageSize: pageSizeValue,
        ...this.state.filtersAppliedValue,
        isLazy: lazyDataLoading,
      };
      this.props.handleSubmitAction(actionConsts.ACTION_TYPE_LIST, params);
    });
  };
  handleStandardTableChange = (pagination, _filters, sorter) => {
    this.setState(
      {
        currentPageValue: pagination.current - 1,
        pageSizeValue: pagination.pageSize,
      },
      () => {
        if (this.state.lazyDataLoading === true) {
          let sortOrder = '';
          if (sorter.order === 'descend') {
            sortOrder = 'desc';
          } else if (sorter.order === 'ascend') {
            sortOrder = 'asc';
          }
          let sortField = '';
          if (sorter.field) {
            sortField = sorter.field;
          }
          const params = {
            sortField,
            sortOrder,
            currentPage: pagination.current - 1,
            pageSize: pagination.pageSize,
            ...this.state.filtersAppliedValue,
            isLazy: true,
          };
          this.setState(
            {
              loading: true,
            },
            () => {
              this.props.handleSubmitAction(
                actionConsts.ACTION_TYPE_LIST,
                params,
              );
            },
          );
        }
      },
    );
  };
  showTotal = (total, range) => `${range[0]}-${range[1]} of ${total} items`;
  onShowSizeChange = () => { };
  toggleTableRowsSelected = value => {
    const selectedIds = [];
    const data = this.props.data.content || [];
    data.map(v => selectedIds.push(v.id));
    if (value === true) {
      this.setState(
        {
          selectedRowKeys: selectedIds,
          selectedObjects: data,
        },
        () => {
          if (this.state.selectedObjects) {
            this.state.selectedObjects.map(v => (v.dialogContent = v.name));
          }
          const dataForAction = {
            selectedIds: this.state.selectedRowKeys,
            selectedName: this.state.selectedObjects,
          };
          this.props.handleSubmitAction(
            actionConsts.ACTION_TYPE_MULTIPLE_SELECTION,
            dataForAction,
          );
        },
      );
    } else {
      this.setState({ selectedRowKeys: [], selectedObjects: [] }, () => {
        const dataForAction = {
          selectedIds: this.state.selectedRowKeys,
          selectedName: this.state.selectedObjects,
        };
        this.props.handleSubmitAction(
          actionConsts.ACTION_TYPE_MULTIPLE_SELECTION,
          dataForAction,
        );
      });
    }
  };
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState(
      {
        selectedRowKeys,
        selectedObjects: selectedRows,
      },
      () => {
        this.state.selectedObjects.map(v => (v.dialogContent = v.name));
        const dataForAction = {
          selectedIds: this.state.selectedRowKeys,
          selectedName: this.state.selectedObjects,
        };
        this.props.handleSubmitAction(
          actionConsts.ACTION_TYPE_MULTIPLE_SELECTION,
          dataForAction,
        );
      },
    );
  };
  toggleTableRowsSelectedClear = () => {
    this.setState({ selectedRowKeys: [] });
  };
  handleColumnFilterSearch = (selectedKeys, handleConfirm) => () => {
    handleConfirm();
    this.setState({ searchText: selectedKeys[0] });
  };
  handleColumnFilterReset = clearFilters => () => {
    clearFilters();
    this.setState({ searchText: '' });
  };
}
FinancialAccountTable.propTypes = {
  setClick: PropTypes.func,
  handleSubmitAction: PropTypes.func,
  data: PropTypes.any,
  toggleEdit: PropTypes.func,
  toggleView: PropTypes.func,
  clearSelected: PropTypes.func,
};
export default connect(({ FinancialAccount }) => ({
  data: FinancialAccount.reducerSave,
}))(FinancialAccountTable);
