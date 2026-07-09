import { screen, within } from '@testing-library/react';
import TradeHistoryPage from './TradeHistoryPage';
import { renderWithProviders } from '../../../../tests/utils';

describe('TradeHistoryPage', () => {
  it('renders the page header with title, badge, and description', () => {
    renderWithProviders(<TradeHistoryPage />);

    expect(screen.getByRole('heading', { name: 'Trade History' })).toBeInTheDocument();
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.getByText(/A unified archive of all your domestic and international trade documents/)).toBeInTheDocument();
  });

  it('renders the document overview section with all document type cards', () => {
    renderWithProviders(<TradeHistoryPage />);

    const overview = screen.getByRole('region', { name: 'Document Overview' });
    expect(within(overview).getByText('Purchase Order')).toBeInTheDocument();
    expect(within(overview).getByText('Credit Note')).toBeInTheDocument();
    expect(within(overview).getByText('Debit Note')).toBeInTheDocument();
    expect(within(overview).getByText('E-Way Bill')).toBeInTheDocument();
    expect(within(overview).getByText('Contract')).toBeInTheDocument();
    expect(within(overview).getByText('Proforma Invoice')).toBeInTheDocument();
    expect(within(overview).getByText('Packing List')).toBeInTheDocument();
    expect(within(overview).getByText('Commercial Invoice')).toBeInTheDocument();
  });

  it('renders the recent activity table with placeholder rows', () => {
    renderWithProviders(<TradeHistoryPage />);

    const table = screen.getByRole('table', { name: 'Recent trade documents' });
    expect(table).toBeInTheDocument();
    expect(screen.getByText('DOC-0001')).toBeInTheDocument();
    expect(screen.getByText('DOC-0005')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText(/Showing placeholder data/)).toBeInTheDocument();
  });

  it('renders the future automation section', () => {
    renderWithProviders(<TradeHistoryPage />);

    expect(screen.getByText('Future Automation')).toBeInTheDocument();
    expect(screen.getByText('Full-text document search')).toBeInTheDocument();
    expect(screen.getByText('Analytics dashboard')).toBeInTheDocument();
  });
});
