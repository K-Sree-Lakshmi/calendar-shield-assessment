import { render, screen, within } from '@testing-library/react';
import Table from './components/Table/Table';
import { useData } from './context/DataContext';

jest.mock('./context/DataContext', () => ({
  useData: jest.fn()
}));

const tableRow = {
  id: 1,
  name: 'Alice Johnson',
  date: '2026-09-20',
  timezone: 'America/New_York',
  amount: 120.5,
  status: 'Paid'
};

const renderTable = () => {
  useData.mockReturnValue({
    tableData: [tableRow],
    loading: false,
    error: null
  });

  render(<Table />);
};

const getDataCells = async () => {
  await screen.findByText('Alice Johnson');
  const rows = screen.getAllByRole('row');
  return within(rows[1]).getAllByRole('cell');
};

test('renders table headers in the intended order', () => {
  renderTable();

  const headerLabels = screen.getAllByRole('columnheader').map(header => (
    header.querySelector('.table-header-item span').textContent
  ));

  expect(headerLabels).toEqual(['Name', 'Date', 'TimeZone', 'Amount', 'Status']);
});

test('renders row values under matching headers', async () => {
  renderTable();

  const cells = await getDataCells();

  expect(cells[0]).toHaveTextContent('Alice Johnson');
  expect(cells[1]).toHaveTextContent('2026-09-20');
  expect(cells[2]).toHaveTextContent('America/New_York');
  expect(cells[3]).toHaveTextContent('$120.50');
  expect(cells[4]).toHaveTextContent('Paid');
});

test('formats amount as currency and renders status as a badge', async () => {
  renderTable();

  const cells = await getDataCells();
  const statusBadge = within(cells[4]).getByText('Paid');

  expect(cells[3]).toHaveTextContent('$120.50');
  expect(statusBadge).toHaveClass('status-badge', 'paid');
});
