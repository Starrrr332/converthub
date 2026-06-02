import { useTranslation } from 'react-i18next';
import { PageLayout } from '../../components/layout/PageLayout';
import { FileEncryptor } from '../../components/tools/FileEncryptor';

export function FileEncryptorPage() {
  const { t } = useTranslation();
  return (
    <PageLayout
      title="Encriptador de Archivos"
      subtitle="AES-256-GCM. Tus archivos nunca salen de tu navegador."
      breadcrumb={[{ label: t('nav.home'), to: '/' }, { label: 'Encriptador' }]}
    >
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <FileEncryptor />
        </div>
      </div>
    </PageLayout>
  );
}
