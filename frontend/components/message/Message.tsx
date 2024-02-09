import 'themes/intertwine/components/message.scss';

export default function Message({own}: {own?: boolean}) {
  return (
    <div className={own ? 'message own' : 'message'}>
        <div className="message-top">
            <img className="message-image" src="images/no-profile-picture.png" alt="" />
            <p className="message-text">Example text</p>
        </div>
        <div className="message-bottom">
            1 hour ago
        </div>
    </div>
  )
}
