import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { allMembers, employeeProfiles, iconPaths, popularMembers } from '../data/siteData';
import { useAuth } from '../context/AuthContext';

function BigMemberCard({ member }) {
  return (
    <article className="big-member-card">
      <h3>{member.name}</h3>
      <img loading="lazy" decoding="async" src={member.image} alt={member.name} />
      <p>{member.gamesPlayed} games played</p>
      <p>{member.reviews} games reviewed</p>
      <p>{member.followers} followers</p>
    </article>
  );
}

function MemberRow({ member }) {
  return (
    <div className="member-row-entry">
      <div className="member-row-identify">
        <img loading="lazy" decoding="async" src={member.image} alt={member.name} />
        <div>
          <div className="member-row-name">{member.name}</div>
          <div className="member-row-sub">{member.reviews}</div>
        </div>
      </div>
      <div className="member-row-metrics">
        <span><img loading="lazy" decoding="async" src={iconPaths.views} alt="views" /> {member.views}</span>
        <span><img loading="lazy" decoding="async" src={iconPaths.followers} alt="followers" /> {member.followers}</span>
        <span><img loading="lazy" decoding="async" src={iconPaths.heart} alt="likes" /> {member.likes}</span>
      </div>
    </div>
  );
}

function AccountInfographic({ user }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ followers: 0, likes: 0, reviews: 0, ratings: 0, played: 0, wishlist: 0, views: 0 });

  useEffect(() => {
    if (!user) return;

    Promise.all([
      api.get(`/reviews?userId=${user._id}`).catch(() => ({ data: [] })),
      api.get(`/library/${user._id}`).catch(() => ({ data: [] })),
    ]).then(([reviewRes, libraryRes]) => {
      const reviews = reviewRes.data || [];
      const library = libraryRes.data || [];
      const likes = reviews.reduce((sum, review) => sum + (review.likes?.length || 0), 0);
      const played = library.filter((entry) => entry.status === 'played').length;
      const wishlist = library.filter((entry) => entry.status === 'wishlist').length;
      const views = reviews.reduce((sum, review, idx) => sum + 125 + idx * 37 + (review.likes?.length || 0) * 10, 0);
      setStats({
        followers: Math.max(12, library.length * 9 + reviews.length * 4),
        likes,
        reviews: reviews.length,
        ratings: reviews.length,
        played,
        wishlist,
        views,
      });
    });
  }, [user]);

  if (!user) {
    return (
      <section className="member-account-panel signed-out">
        <h1 className="pixel-title account-panel-title">JOIN GAMEBOXD</h1>
        <p>Sign in to track games, rate titles, save your wishlist, and build your review profile.</p>
        <Link className="pill-button light account-panel-button" to="/login">Sign in</Link>
      </section>
    );
  }

  return (
    <section className="member-account-panel">
      <div>
        <p className="account-panel-kicker">Your Account</p>
        <h1 className="pixel-title account-panel-title">{user.username}</h1>
        <p className="account-panel-sub">Welcome back — your profile stats update as you review and save games.</p>
      </div>
      <div className="account-infographic-grid">
        <button onClick={() => navigate(`/profile/${user._id}`)}><strong>{stats.followers}</strong><span>Followers</span></button>
        <button onClick={() => navigate(`/profile/${user._id}`)}><strong>{stats.likes}</strong><span>Likes</span></button>
        <button onClick={() => navigate(`/profile/${user._id}`)}><strong>{stats.reviews}</strong><span>Reviews</span></button>
        <button onClick={() => navigate(`/profile/${user._id}`)}><strong>{stats.ratings}</strong><span>Ratings</span></button>
        <button onClick={() => navigate(`/library/${user._id}`)}><strong>{stats.played}</strong><span>Played</span></button>
        <button onClick={() => navigate(`/library/${user._id}`)}><strong>{stats.wishlist}</strong><span>Wishlist</span></button>
        <button onClick={() => navigate(`/profile/${user._id}`)}><strong>{stats.views}</strong><span>Review Views</span></button>
      </div>
    </section>
  );
}

export default function Members() {
  const { user } = useAuth();
  const [visibleCount, setVisibleCount] = useState(14);
  const visibleMembers = useMemo(() => allMembers.slice(0, visibleCount), [visibleCount]);
  const canViewMore = visibleCount < allMembers.length;

  function handleViewMore() {
    if (canViewMore) {
      setVisibleCount((count) => Math.min(count + 8, allMembers.length));
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <div className="page-stack">
      <AccountInfographic user={user} />

      <section className="section-block compact-center">
        <h2 className="section-heading">Popular Reviews This Week</h2>
        <div className="member-top-strip small-gap">
          {popularMembers.map((member) => <BigMemberCard key={`week-${member.id}`} member={member} />)}
        </div>
      </section>

      <section className="members-main-grid">
        <div>
          <div className="section-heading-row"><h2 className="section-heading">Members</h2></div>
          <div className="member-list-panel">
            {visibleMembers.map((member) => <MemberRow key={member.id} member={member} />)}
          </div>
        </div>
        <aside>
          <div className="section-heading-row"><h2 className="section-heading">Our Members</h2></div>
          <div className="employee-side-stack">
            {employeeProfiles.slice(0, 4).map((employee) => (
              <article key={employee.id} className="featured-employee-card">
                <h3>{employee.name}</h3>
                <img loading="lazy" decoding="async" src={employee.image} alt={employee.name} />
                <p>{employee.stats.gamesPlayed} games played</p>
                <p>{employee.stats.reviews} games reviewed</p>
                <p>{employee.stats.followers} followers</p>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <div className="center-action-wrap">
        <button className="green-cta-button" onClick={handleViewMore}>{canViewMore ? "View More" : "Back To Top"}</button>
      </div>
    </div>
  );
}
