interface LoadingBannerProps {
    pageName: string
}

export function LoadingBanner({pageName}: LoadingBannerProps) {
  return (
    <div className="loadingState">
      <p>Loading {pageName}</p>
      <div className="loader"></div>
    </div>
  );
}
