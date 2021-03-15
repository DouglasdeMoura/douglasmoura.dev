import { useRef } from 'react';
import { FaTwitter, FaFacebook, FaLinkedin } from 'react-icons/fa';
import { Share01, Link } from 'react-zondicons';
import __ from '../i18n/locales';

export default function Share() {
  const shareMenu = useRef(null);
  const openShareMenu = useRef(null);

  const openMenu = () => {
    shareMenu.current.hidden = !shareMenu.current.hidden;
    openShareMenu.current.classList.toggle('selected');
  }

  const shareLink = (event) => {
    let url;
    const postUrl = window.location.href;
    const title = document.getElementsByClassName('entry-title')[0].innerText;
    const network = event.currentTarget.dataset.shareOn;

    switch (network) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${title} por @douglasdemoura ${postUrl}`;
        break;
      case 'facebook':
        url = `https://facebook.com/sharer/sharer.php?u=${postUrl}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`;
        break;
    }

    window.open(url);
  }

  const copyUrlToClipboard = () => {
    const dummyInput = document.createElement('input');
    const text = window.location.href;
    document.body.appendChild(dummyInput);
    dummyInput.value = text;
    dummyInput.select();
    document.execCommand('copy');
    document.body.removeChild(dummyInput);
  }

  return (
    <span className="share" ref={openShareMenu}>
      <button title={__('Share')}>
        <span className="screen-reader-text">
          {__('Share')}
        </span>
        <Share01
          size={20}
          onClick={openMenu}
        />
      </button>

      <div
        className="share-menu"
        hidden={true}
        ref={shareMenu}
      >
        <button onClick={shareLink} data-share-on="twitter">
          <FaTwitter /> Twitter
        </button>
        <button onClick={shareLink} data-share-on="facebook">
          <FaFacebook /> Facebook
        </button>
        <button onClick={shareLink} data-share-on="linkedin">
          <FaLinkedin /> LinkedIn
        </button>
        <button onClick={copyUrlToClipboard} data-share-on="clipboard">
          <Link size={16} />{__('Copy link')}
        </button>
      </div>
    </span>
  );
}
